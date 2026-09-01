/* =========================================================
   app.js
   نقطة تشغيل تطبيق Express لموقع قسم قائد
   ========================================================= */

require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");

const homeRoutes = require("./routes/homeRoutes");
const guardianRoutes = require("./routes/guardianRoutes");
const groupRoutes = require("./routes/groupRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");
const displayRoutes = require("./routes/displayRoutes");
const dailyAttendanceRoutes = require("./routes/dailyAttendanceRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// نثق بالبروكسي الأمامي (Railway) حتى يتعرّف Express على أن الاتصال HTTPS فعلياً
// عبر ترويسة X-Forwarded-Proto، وإلا فلن يُحفَظ كوكي الجلسة (secure: true) أبداً
// ويفشل تسجيل دخول المشرف/الإدارة في الإنتاج رغم صحة الرمز
// Auto-migrate new columns
const pool = require("./config/db");
(async () => {
  try {
    await pool.query("ALTER TABLE students ADD COLUMN cultural_points INT DEFAULT 0, ADD COLUMN sports_points INT DEFAULT 0");
    console.log("Auto-migration: Added cultural/sports points columns");
  } catch (err) {
    if (err.code !== "ER_DUP_FIELDNAME") {
      console.error("Auto-migration error:", err);
    }
  }

  try {
    // Check if we need to migrate sessions
    const [rows] = await pool.query("SELECT COUNT(*) AS c FROM sessions WHERE session_date = '2026-12-14'");
    if (rows[0].c === 0) {
      console.log("Migrating sessions table to specific dates...");
      
      const requiredDates = ["2026-09-28", "2026-10-12", "2026-10-26", "2026-11-09", "2026-11-30", "2026-12-14"];
      
      // Delete sessions that are not in the required dates
      await pool.query("DELETE FROM sessions WHERE session_date NOT IN (?)", [requiredDates]);
      
      // Insert the required dates if they don't exist
      const sessionsToInsert = [
        ["2026-09-28", "الإثنين", 3],
        ["2026-10-12", "الإثنين", 5],
        ["2026-10-26", "الإثنين", 7],
        ["2026-11-09", "الإثنين", 9],
        ["2026-11-30", "الإثنين", 12],
        ["2026-12-14", "الإثنين", 14]
      ];
      
      for (const s of sessionsToInsert) {
        await pool.query("INSERT IGNORE INTO sessions (session_date, day_name, week_number) VALUES (?, ?, ?)", s);
      }
      console.log("Auto-migration: Sessions updated");
    }
  } catch (err) {
    console.error("Auto-migration sessions error:", err);
  }
})();

app.set("trust proxy", 1);

/* -------- محرك القوالب EJS -------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------- قراءة بيانات النماذج (form-data) و JSON -------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -------- الملفات الثابتة (CSS / JS / صور) -------- */
app.use(express.static(path.join(__dirname, "public")));

/* -------- الجلسات (لتسجيل دخول المشرف) -------- */
app.use(session({
  secret: process.env.SESSION_SECRET || "qayrawan-club-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 يوماً
    secure: process.env.NODE_ENV === "production",
  },
}));

/* -------- متغيرات عامة متاحة في كل القوالب -------- */
app.use((req, res, next) => {
  res.locals.isSupervisor = !!(req.session && req.session.isSupervisor);
  res.locals.currentYear = new Date().getFullYear();
  next();
});

/* -------- المسارات -------- */
app.use("/", homeRoutes);
app.use("/", guardianRoutes);
app.use("/", groupRoutes);
app.use("/", supervisorRoutes);
app.use("/", displayRoutes);
app.use("/", dailyAttendanceRoutes);

/* -------- صفحة 404 -------- */
app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "الصفحة غير موجودة", activeNav: "" });
});

/* -------- معالج الأخطاء العام -------- */
app.use((err, req, res, next) => {
  console.error("❌ خطأ في التطبيق:", err);
  res.status(500).render("error", {
    pageTitle: "حدث خطأ",
    activeNav: "",
    message: process.env.NODE_ENV === "production"
      ? "حدث خطأ غير متوقع، حاول مرة أخرى لاحقاً"
      : err.message,
  });
});

// نُشغّل الخادم فقط عند تشغيل هذا الملف مباشرة (node app.js / npm start)
// وليس عند استدعائه من ملفات الاختبار (require("../app")) حتى لا يحجز
// منفذاً فعلياً أثناء تشغيل supertest، الذي ينشئ خادمه المؤقت بنفسه.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 الموقع يعمل الآن على المنفذ ${PORT}`);
  });
}

module.exports = app;
