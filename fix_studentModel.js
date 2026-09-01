const fs = require("fs");
let code = fs.readFileSync("models/studentModel.js", "utf8");

let oldCode = `    const sessionModel = require("./sessionModel");
    const currentSession = await sessionModel.getCurrentOrNextSession();
    let awardedPoints = task.points;
    if (currentSession && task.week_number < currentSession.week_number) {
      awardedPoints = Math.round(task.points / 2);
    }`;

let newCode = `    const programStartDate = new Date("2026-09-10T00:00:00");
    const now = new Date();
    // Calculate the current week number (Week 1 starts on Sep 10, Week 2 on Sep 17, etc.)
    const diffTime = Math.max(0, now.getTime() - programStartDate.getTime());
    const currentWeekNumber = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    let awardedPoints = task.points;
    if (task.week_number < currentWeekNumber) {
      awardedPoints = Math.round(task.points / 2);
    }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync("models/studentModel.js", code);
console.log("Updated studentModel.js");

