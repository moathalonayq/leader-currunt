const fs = require("fs");
let code = fs.readFileSync("views/supervisor-panel.ejs", "utf8");

const megaGroupSectionStart = code.indexOf("<!-- =========================================================\r\n         New) إدارة المجموعات الكبرى");
if (megaGroupSectionStart === -1 && code.indexOf("<!-- =========================================================\n         New) إدارة المجموعات الكبرى") !== -1) {
  // alternative line endings
}
// Actually, let us just use replace with regex.
code = code.replace(/<!-- =========================================================\r?\n\s+New\) إدارة المجموعات الكبرى[\s\S]*?<h3 class="panel-group-title">👤 إدارة الطلاب<\/h3>/, "<h3 class=\"panel-group-title\">👤 إدارة الطلاب</h3>");

const newCatPointsForm = `
      <!-- البرنامج الرياضي والثقافي والجماهيري -->
      <div class="panel-box">
        <h4>🏅 البرنامج الرياضي والثقافي والجماهيري</h4>
        <form id="catPointsForm">
          <div class="form-group">
            <label>اختر المجموعة</label>
            <select id="catPointsMegaGroupSelect" class="form-select" required>
              <option value="">اختر المجموعة</option>
              <% megaGroups.forEach(mg => { %>
                <option value="<%= mg.id %>"><%= mg.name %></option>
              <% }) %>
            </select>
          </div>
          <div class="form-group">
            <label for="catPointsCategory">البرنامج</label>
            <select id="catPointsCategory" class="form-select" required>
              <option value="">اختر البرنامج</option>
              <option value="cultural">الثقافي</option>
              <option value="sports">الرياضي</option>
              <option value="audience">الجماهيري</option>
            </select>
          </div>
          <div class="form-group">
            <label for="catPointsAmount">عدد النقاط</label>
            <select id="catPointsAmount" class="form-select">
              <option value="0">0</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
            </select>
          </div>
          <button type="button" id="updateCatPointsBtn" class="btn btn-gold" style="width:100%;">تحديث النقاط</button>
          <p class="form-msg" id="catPointsMsg"></p>
        </form>
      </div>
`;

code = code.replace(/<!-- البرنامج الرياضي والثقافي -->[\s\S]*?<!-- تقييم إنجاز الذاتي الأسبوعي -->/, newCatPointsForm + "\n      <!-- تقييم إنجاز الذاتي الأسبوعي -->");

fs.writeFileSync("views/supervisor-panel.ejs", code);
console.log("Updated supervisor panel properly");

