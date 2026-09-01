/* =========================================================
   controllers/homeController.js
   منطق الصفحة الرئيسية: نظرة عامة على النادي + المتصدرون
   ========================================================= */

const statsModel = require("../models/statsModel");
const studentModel = require("../models/studentModel");

async function showHome(req, res, next) {
  try {
    const stats = await statsModel.getHomeStats();
    // جلب جميع الطلاب (بحد أقصى 100 لضمان جلب الجميع) لتمثيلهم على الخريطة
    const allStudents = await studentModel.getTopStudents(100);
    const TARGET_POINTS = 1000;

    res.render("home", {
      pageTitle: "رحلة الوعد إلى مكة",
      activeNav: "home",
      stats,
      allStudents,
      TARGET_POINTS,
    });
  } catch (err) {
    next(err);
  }
}

async function showIndividual(req, res, next) {
  try {
    const allStudents = await studentModel.getTopStudents(500);

    res.render("individual", {
      pageTitle: "الفردي",
      activeNav: "individual",
      allStudents
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { showHome, showIndividual };
