const fs = require("fs");
let code = fs.readFileSync("app.js", "utf8");
code = code.replace(`  } catch (err) {
    console.error("Auto-migration mega_groups error:", err);
  }
    if (err.code !== "ER_DUP_FIELDNAME") {
      console.error("Auto-migration error:", err);
    }
  }`, `    if (err.code !== "ER_DUP_FIELDNAME") {
      console.error("Auto-migration error:", err);
    }
  }`);
fs.writeFileSync("app.js", code);

