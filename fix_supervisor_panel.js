const fs = require("fs");
let code = fs.readFileSync("views/supervisor-panel.ejs", "utf8");

const megaGroupHtml = `
    <!-- =========================================================
         New) إدارة المجموعات الكبرى (العطاء، البناء، الإخاء)
         ========================================================= -->
    <h3 class="panel-group-title">🏆 إدارة المجموعات</h3>
    <div class="panel-box">
      <form id="megaGroupForm">
        <div class="form-group">
          <label>المجموعة</label>
          <select id="megaGroupId" class="form-select" required>
            <option value="" disabled selected>اختر المجموعة</option>
            <% megaGroups.forEach(mg => { %>
              <option value="<%= mg.id %>"><%= mg.name %></option>
            <% }) %>
          </select>
        </div>
        <div class="form-group">
          <label>المحور</label>
          <select id="megaGroupAxis" class="form-select" required>
            <option value="" disabled selected>اختر المحور</option>
            <option value="cultural">الثقافي</option>
            <option value="sports">الرياضي</option>
            <option value="audience">الجماهيري</option>
          </select>
        </div>
        <div class="form-group">
          <label>النقاط (يمكن أن تكون بالسالب للخصم)</label>
          <input type="number" id="megaGroupPoints" class="form-input" required>
        </div>
        <button type="submit" class="btn btn-primary" id="megaGroupSubmitBtn">تحديث النقاط</button>
      </form>
    </div>
`;

code = code.replace(
  `<h3 class="panel-group-title">👤 إدارة الطلاب</h3>`,
  megaGroupHtml + `\n          <h3 class="panel-group-title">👤 إدارة الطلاب</h3>`
);

fs.writeFileSync("views/supervisor-panel.ejs", code);
console.log("Updated supervisor-panel");

