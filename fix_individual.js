const fs = require("fs");
let code = fs.readFileSync("views/individual.ejs", "utf8");

const mediaQuery = `
      @media (max-width: 600px) {
        .individual-card {
          flex-wrap: wrap;
          gap: 12px;
          padding: 12px 15px;
        }
        .ind-info {
          flex: 1;
        }
        .ind-stats-container {
          width: 100%;
          order: 4; /* push to bottom */
          justify-content: center;
        }
        .ind-stat {
          flex: 1;
          padding: 6px;
        }
        .ind-stat-value {
          font-size: 16px;
        }
        .ind-stat-label {
          font-size: 10px;
        }
        .ind-points {
          padding: 8px 12px;
          min-width: 60px;
        }
        .ind-points-value {
          font-size: 20px;
        }
        .ind-name {
          font-size: 16px;
        }
      }
    </style>
`;

code = code.replace("    </style>", mediaQuery);

fs.writeFileSync("views/individual.ejs", code);
console.log("Updated individual.ejs with media query");

