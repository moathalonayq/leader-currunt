const fs = require("fs");
let code = fs.readFileSync("models/studentModel.js", "utf8");
code = code.replace(
  "(s.knowledge_points + s.attendance_points\n        + COALESCE((SELECT SUM(i.points) FROM initiatives i WHERE i.student_id = s.id), 0)\n      ) AS total_points",
  "(s.knowledge_points + s.attendance_points + COALESCE(s.cultural_points, 0) + COALESCE(s.sports_points, 0) + COALESCE((SELECT SUM(i.points) FROM initiatives i WHERE i.student_id = s.id), 0)) AS total_points"
);
code = code.replace(
  "(knowledge_points + attendance_points\n        + COALESCE((SELECT SUM(i.points) FROM initiatives i WHERE i.student_id = students.id), 0)\n      ) AS total_points",
  "(knowledge_points + attendance_points + COALESCE(cultural_points, 0) + COALESCE(sports_points, 0) + COALESCE((SELECT SUM(i.points) FROM initiatives i WHERE i.student_id = students.id), 0)) AS total_points"
);
fs.writeFileSync("models/studentModel.js", code);

