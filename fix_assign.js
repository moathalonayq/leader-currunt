const fs = require("fs");
let code = fs.readFileSync("views/supervisor-panel.ejs", "utf8");

const assignHtml = `
      <hr style="margin: 30px 0; border-color: #e2e8f0;">
      <h4 style="margin-top:0;">🔗 ربط الأسر بالمجموعات الكبرى</h4>
      <form id="assignMegaGroupForm">
        <div class="form-group">
          <label>الأسرة</label>
          <select id="assignGroupId" class="form-select" required>
            <option value="" disabled selected>اختر الأسرة</option>
            <% groups.forEach(g => { %>
              <option value="<%= g.id %>"><%= g.name %></option>
            <% }) %>
          </select>
        </div>
        <div class="form-group">
          <label>المجموعة الكبرى</label>
          <select id="assignMegaGroupId" class="form-select">
            <option value="">بدون مجموعة (إزالة الربط)</option>
            <% megaGroups.forEach(mg => { %>
              <option value="<%= mg.id %>"><%= mg.name %></option>
            <% }) %>
          </select>
        </div>
        <button type="submit" class="btn btn-outline" style="width:100%;" id="assignSubmitBtn">حفظ الربط</button>
      </form>
`;

code = code.replace("    </div>\n\n          <h3 class=\"panel-group-title\">👤 إدارة الطلاب</h3>", assignHtml + "    </div>\n\n          <h3 class=\"panel-group-title\">👤 إدارة الطلاب</h3>");
if (!code.includes("assignMegaGroupForm")) {
  // Try another replace pattern
  code = code.replace("    </div>\r\n\r\n          <h3 class=\"panel-group-title\">👤 إدارة الطلاب</h3>", assignHtml + "    </div>\r\n\r\n          <h3 class=\"panel-group-title\">👤 إدارة الطلاب</h3>");
}
if (!code.includes("assignMegaGroupForm")) {
  code = code.replace(/<h3 class="panel-group-title">👤 إدارة الطلاب<\/h3>/, assignHtml + "\n          <h3 class=\"panel-group-title\">👤 إدارة الطلاب</h3>");
}

fs.writeFileSync("views/supervisor-panel.ejs", code);
console.log("Restored assign form");

