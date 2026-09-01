
const fs = require("fs");
let code = fs.readFileSync("views/groups.ejs", "utf8");

code = code.replace(
  "members: g.members.map(m => ({ id: m.id, name: m.name, total_points: m.total_points, knowledge_points: m.knowledge_points, attendance_points: m.attendance_points, initiatives_points: m.initiatives_points }))",
  "members: g.members.map(m => ({ id: m.id, name: m.name, total_points: m.total_points, knowledge_points: m.knowledge_points, attendance_points: m.attendance_points, initiatives_points: m.initiatives_points, cultural_points: m.cultural_points, sports_points: m.sports_points }))"
);

code = code.split("\\\\`").join("`");
code = code.split("\\\\$").join("$");

fs.writeFileSync("views/groups.ejs", code);
console.log("Fixed groups.ejs");

