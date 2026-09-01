const fs = require("fs");
let code = fs.readFileSync("views/partials/header.ejs", "utf8");

code = code.replace(
  `<a href="/groups" class="nav-btn <%= activeNav === \'groups\' ? \'active\' : \'' %>">المجموعات</a>`,
  `<a href="/groups" class="nav-btn <%= activeNav === \'groups\' ? \'active\' : \'' %>">الاسر</a>
      <a href="/mega-groups" class="nav-btn <%= activeNav === \'mega-groups\' ? \'active\' : \'' %>">المجموعات</a>`
);

fs.writeFileSync("views/partials/header.ejs", code);
console.log("Updated header");

