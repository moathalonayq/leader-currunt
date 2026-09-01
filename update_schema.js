const fs = require("fs");
let code = fs.readFileSync("config/schema.sql", "utf8");

// Remove the old INSERT INTO sessions
let insertStart = code.indexOf("INSERT INTO sessions");
if (insertStart > -1) {
  let insertEnd = code.indexOf(";", insertStart);
  if (insertEnd > -1) {
    let newInsert = `INSERT INTO sessions (session_date, day_name, week_number) VALUES
  ("2026-09-28", "الإثنين", 3),
  ("2026-10-12", "الإثنين", 5),
  ("2026-10-26", "الإثنين", 7),
  ("2026-11-09", "الإثنين", 9),
  ("2026-11-30", "الإثنين", 12),
  ("2026-12-14", "الإثنين", 14)`;
    code = code.substring(0, insertStart) + newInsert + code.substring(insertEnd);
    fs.writeFileSync("config/schema.sql", code);
    console.log("Updated schema.sql");
  }
}

