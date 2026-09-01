const fs = require("fs");
let code = fs.readFileSync("views/mega-groups.ejs", "utf8");

const responsiveStyle = `
  <style>
    @media (max-width: 600px) {
      .group-summary-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .group-summary-info {
        width: 100%;
        margin-top: 10px;
      }
      .group-summary-total {
        margin-top: 15px;
        font-size: 24px !important;
      }
    }
  </style>
`;

code = code.replace("</section>", responsiveStyle + "\\n</section>");
fs.writeFileSync("views/mega-groups.ejs", code);
console.log("Made mega-groups responsive");

