const fs = require("fs");
let code = fs.readFileSync("models/studentModel.js", "utf8");

const replacement = `async function setSelfAchievementDone(studentId, taskId, done) {
  const [taskRows] = await pool.query(
    "SELECT id, week_number, title, points FROM weekly_self_tasks WHERE id = ?",
    [taskId]
  );
  if (!taskRows.length) return null;
  const task = taskRows[0];

  const [existing] = await pool.query(
    "SELECT id, points FROM self_achievements WHERE student_id = ? AND task_id = ?",
    [studentId, taskId]
  );

  if (done && !existing.length) {
    if (!task.points || task.points <= 0) {
      return { error: "لا يمكن إنجاز هذا المتطلب لأن نقاطه صفرية من إعدادات الذاتي" };
    }
    const sessionModel = require("./sessionModel");
    const currentSession = await sessionModel.getCurrentOrNextSession();
    let awardedPoints = task.points;
    if (currentSession && task.week_number < currentSession.week_number) {
      awardedPoints = Math.round(task.points / 2);
    }
    
    await pool.query(
      "INSERT INTO self_achievements (student_id, task_id, points) VALUES (?, ?, ?)",
      [studentId, taskId, awardedPoints]
    );
    await pool.query(
      "UPDATE students SET knowledge_points = GREATEST(knowledge_points + ?, 0) WHERE id = ?",
      [awardedPoints, studentId]
    );
  } else if (!done && existing.length) {
    const prevPoints = Number(existing[0].points) || 0;
    await pool.query("DELETE FROM self_achievements WHERE id = ?", [existing[0].id]);
    await pool.query(
      "UPDATE students SET knowledge_points = GREATEST(knowledge_points - ?, 0) WHERE id = ?",
      [prevPoints, studentId]
    );
  }

  return task;
}`;

// I need to properly find and replace the whole function in JS to avoid regex issues.
// Since studentModel.js has it, I will replace the function body manually.


let startIndex = code.indexOf("async function setSelfAchievementDone(studentId, taskId, done) {");
let endIndex = code.indexOf("/* -------- تحديث رقم ولي الأمر -------- */", startIndex);
if(endIndex === -1) endIndex = code.indexOf("/* --------", startIndex + 50);

if (startIndex > -1 && endIndex > -1) {
  code = code.substring(0, startIndex) + replacement + "\n\n  " + code.substring(endIndex);
  fs.writeFileSync("models/studentModel.js", code);
  console.log("Patched setSelfAchievementDone");
} else {
  console.log("Could not find bounds", startIndex, endIndex);
}

