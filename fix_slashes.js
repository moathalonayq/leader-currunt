const fs = require("fs");
let code = fs.readFileSync("views/groups.ejs", "utf8");
code = code.split("\\\`").join("\`");
code = code.split("\\\$").join("\$");
fs.writeFileSync("views/groups.ejs", code);

