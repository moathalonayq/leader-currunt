const fs = require("fs");
let code = fs.readFileSync("public/js/supervisor.js", "utf8");

const assignJs = `
  const assignMegaGroupForm = document.getElementById("assignMegaGroupForm");
  if (assignMegaGroupForm) {
    assignMegaGroupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const groupId = document.getElementById("assignGroupId").value;
      const megaGroupId = document.getElementById("assignMegaGroupId").value;
      
      const btn = document.getElementById("assignSubmitBtn");
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "جاري الحفظ...";
      
      try {
        const res = await fetch("/supervisor/api/supervisor/mega-groups/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId, megaGroupId })
        });
        const data = await res.json();
        if (data.success) {
          alert("تم حفظ الربط بنجاح!");
          window.location.reload();
        } else {
          alert(data.error || "حدث خطأ");
        }
      } catch(err) {
        alert("خطأ في الاتصال");
      } finally {
        btn.disabled = false;
        btn.textContent = origText;
      }
    });
  }
`;

code = code.replace("document.addEventListener(\"DOMContentLoaded\", () => {", "document.addEventListener(\"DOMContentLoaded\", () => {\\n" + assignJs);

fs.writeFileSync("public/js/supervisor.js", code);

