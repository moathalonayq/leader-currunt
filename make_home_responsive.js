const fs = require("fs");
let code = fs.readFileSync("views/home.ejs", "utf8");

const mediaQueries = `
      @media (max-width: 768px) {
        .legendary-wrapper {
          padding: 20px 15px;
          border-radius: 16px;
        }
        .l-title {
          font-size: 22px;
          margin-bottom: 8px;
        }
        .l-desc {
          font-size: 13px;
        }
        .l-header {
          margin-bottom: 30px;
        }
        .l-name-plate {
          width: 120px !important;
          padding-left: 10px !important;
        }
        .l-grid {
          right: 130px !important;
        }
        .l-student-name {
          font-size: 12px;
        }
        .l-group-name {
          font-size: 10px;
        }
        .l-score {
          font-size: 11px;
          padding: 2px 6px;
        }
        .l-car {
          font-size: 20px;
          left: -12px;
          top: -12px;
        }
        .l-row {
          margin-bottom: 20px;
        }
        
        /* Schedule Table Mobile adjustments */
        .schedule-wrapper {
          padding: 10px !important;
        }
        .schedule-title {
          font-size: 18px !important;
        }
        .schedule-table th, .schedule-table td {
          padding: 6px !important;
          font-size: 14px !important;
        }
        .schedule-table {
          min-width: 500px !important; /* Allow it to be smaller but still scroll */
        }
      }
    </style>
`;

code = code.replace("    </style>", mediaQueries);

// Also add classes to the schedule table to make them targeted by the media query
code = code.replace(
  `<div style="background-color: white; color: black; padding: 20px; border-radius: 8px; margin-bottom: 30px; font-family: Arial, sans-serif; overflow-x: auto;">`, 
  `<div class="schedule-wrapper" style="background-color: white; color: black; padding: 20px; border-radius: 8px; margin-bottom: 30px; font-family: Arial, sans-serif; overflow-x: auto;">`
);
code = code.replace(
  `<h3 style="text-align: center; font-weight: bold; margin-bottom: 15px; color: black; font-size: 24px;">`,
  `<h3 class="schedule-title" style="text-align: center; font-weight: bold; margin-bottom: 15px; color: black; font-size: 24px;">`
);
code = code.replace(
  `<table style="width: 100%; border-collapse: collapse; text-align: center; border: 2px solid black; direction: rtl; min-width: 700px;">`,
  `<table class="schedule-table" style="width: 100%; border-collapse: collapse; text-align: center; border: 2px solid black; direction: rtl; min-width: 700px;">`
);

fs.writeFileSync("views/home.ejs", code);
console.log("Updated views/home.ejs with media queries");

