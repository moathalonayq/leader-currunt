const fs = require("fs");
let code = fs.readFileSync("app.js", "utf8");

let replacement = `(async () => {
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
    const [rows] = await pool.query("SELECT COUNT(*) AS c FROM sessions WHERE session_date = \\"2026-09-28\\"");
    if (rows[0].c === 0) {
      console.log("Migrating sessions table...");
      // Delete old attendance to avoid foreign key issues
      await pool.query("DELETE FROM attendance");
      await pool.query("DELETE FROM sessions");
      
      const insertQuery = \`INSERT INTO sessions (session_date, day_name, week_number) VALUES
        ("2026-09-28", "الإثنين", 3),
        ("2026-10-12", "الإثنين", 5),
        ("2026-10-26", "الإثنين", 7),
        ("2026-11-09", "الإثنين", 9),
        ("2026-11-30", "الإثنين", 12),
        ("2026-12-14", "الإثنين", 14)\`;
      
      await pool.query(insertQuery);
      console.log("Auto-migration: Sessions updated");
    }
  } catch (err) {
    console.error("Auto-migration sessions error:", err);
  }
})();`;

code = code.replace(/\(async \(\) => \{[\s\S]*?\}\)\(\);/, replacement);
fs.writeFileSync("app.js", code);
console.log("Updated app.js");

