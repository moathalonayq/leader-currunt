const fs = require("fs");

let code = `
<%- include("partials/header") %>

<section class="app-section active" style="max-width: 1000px; margin: 0 auto;">
  <h2 class="section-title" style="text-align: center; margin-bottom: 30px;">المجموعات</h2>
  
  <div id="megaGroupsList">
    <div class="groups-summary-grid">
      <% megaGroups.forEach((g, i) => { 
        const medalClass = i === 0 ? "medal-gold" : i === 1 ? "medal-silver" : i === 2 ? "medal-bronze" : "";
      %>
        <div class="group-summary-card <%= medalClass %>" onclick="showMegaGroupDetails(<%= i %>)" style="cursor: pointer;">
          <div class="group-summary-rank"><%= i + 1 %></div>
          <div class="group-summary-info">
            <h4 style="font-size: 24px; font-weight: 800; margin-bottom: 10px;"><%= g.name %></h4>
            
            <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
              <div style="background: #f1f5f9; padding: 10px; border-radius: 8px; flex: 1; text-align: center;">
                <span style="display: block; font-size: 14px; color: #64748b;">الثقافي</span>
                <span style="font-weight: bold; color: #0f172a; font-size: 18px;"><%= g.cultural_points %></span>
              </div>
              <div style="background: #f1f5f9; padding: 10px; border-radius: 8px; flex: 1; text-align: center;">
                <span style="display: block; font-size: 14px; color: #64748b;">الرياضي</span>
                <span style="font-weight: bold; color: #0f172a; font-size: 18px;"><%= g.sports_points %></span>
              </div>
              <div style="background: #f1f5f9; padding: 10px; border-radius: 8px; flex: 1; text-align: center;">
                <span style="display: block; font-size: 14px; color: #64748b;">الجماهيري</span>
                <span style="font-weight: bold; color: #0f172a; font-size: 18px;"><%= g.audience_points %></span>
              </div>
            </div>
            
          </div>
          <div class="group-summary-total" style="font-size: 28px;"><%= g.total_points %></div>
        </div>
      <% }) %>
    </div>
  </div>

  <div id="megaGroupDetails" class="hidden">
    <button onclick="showMegaGroupsList()" class="btn btn-outline" style="margin-bottom: 20px;">العودة للمجموعات الكبرى</button>
    <div id="detailsContainer"></div>
  </div>
</section>

<%- include("partials/footer") %>

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
  
  .mega-usra-block {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .mega-usra-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 15px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
  }
  .mega-student-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  .mega-student-item {
    background: #f8fafc;
    padding: 10px 15px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    font-size: 15px;
    color: #334155;
    font-weight: 500;
  }
</style>

<script>
  const allMegaGroups = <%- JSON.stringify(megaGroups) %>;

  function showMegaGroupDetails(index) {
    const mg = allMegaGroups[index];
    const container = document.getElementById("detailsContainer");
    
    let html = \`<h3 style="text-align: center; font-size: 28px; margin-bottom: 20px; color: #f59e0b;">\${mg.name}</h3>\`;
    
    if (mg.usras && mg.usras.length > 0) {
      mg.usras.forEach(usra => {
        html += \`
          <div class="mega-usra-block">
            <div class="mega-usra-title">\${usra.name}</div>
            <div class="mega-student-list">
        \`;
        if (usra.students && usra.students.length > 0) {
          usra.students.forEach(s => {
            html += \`<div class="mega-student-item">\${s.name}</div>\`;
          });
        } else {
          html += \`<div style="color: #94a3b8; font-size: 14px;">لا يوجد طلاب</div>\`;
        }
        html += \`</div></div>\`;
      });
    } else {
      html += \`<p style="text-align: center; color: #64748b; font-size: 16px;">لم يتم ربط أسر بهذه المجموعة الكبرى بعد.</p>\`;
    }
    
    container.innerHTML = html;
    
    document.getElementById("megaGroupsList").classList.add("hidden");
    document.getElementById("megaGroupDetails").classList.remove("hidden");
  }

  function showMegaGroupsList() {
    document.getElementById("megaGroupDetails").classList.add("hidden");
    document.getElementById("megaGroupsList").classList.remove("hidden");
  }
</script>
`;

fs.writeFileSync("views/mega-groups.ejs", code);
console.log("Updated mega-groups.ejs");

