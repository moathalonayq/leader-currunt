const fs = require("fs");
let code = fs.readFileSync("controllers/supervisorController.js", "utf8");

let replacement = `async function sendAllWeeklyReminders(req, res, next) {
  try {
    const weekNumber = Number(req.body.weekNumber);
    const studentIds = req.body.studentIds || [];
    
    if (!weekNumber) {
      return res.status(400).json({ success: false, message: "الرجاء تحديد أسبوع صحيح" });
    }

    const fullList = await studentModel.getWeeklyReminderList(weekNumber);
    // Filter list to only included studentIds, if provided
    const list = studentIds.length > 0 
      ? fullList.filter(s => studentIds.includes(s.id)) 
      : fullList;

    const results = { sent: 0, failed: [] };

    for (const student of list) {
      if (!student.phone) {
        results.failed.push({ name: student.name, reason: "لا يوجد رقم جوال" });
        continue;
      }
      const result = await whatsappService.sendTemplateMessage(student.phone, buildReminderParams(student, weekNumber));
      if (result.success) {
        results.sent++;
      } else {
        results.failed.push({ name: student.name, reason: result.error });
      }
    }

    await pool.query(
      "INSERT INTO activity_log (action) VALUES (?)",
      [\`إرسال تذكيرات واتساب لمجموعة للأسبوع \${weekNumber}: نجح \${results.sent}، فشل \${results.failed.length}\`]
    );

    res.json({ success: true, ...results });
  } catch (err) {
    next(err);
  }
}`;

let start = code.indexOf("async function sendAllWeeklyReminders(req, res, next) {");
let end = code.indexOf("module.exports = {", start);
if (start > -1 && end > -1) {
  code = code.substring(0, start) + replacement + "\n\n  " + code.substring(end);
  fs.writeFileSync("controllers/supervisorController.js", code);
  console.log("Patched sendAllWeeklyReminders");
} else {
  console.log("Could not patch", start, end);
}

