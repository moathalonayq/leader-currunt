const fs = require("fs");
let code = fs.readFileSync("public/js/supervisor.js", "utf8");

const jsCode = `
  const megaGroupForm = document.getElementById("megaGroupForm");
  if (megaGroupForm) {
    megaGroupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const groupId = document.getElementById("megaGroupId").value;
      const axis = document.getElementById("megaGroupAxis").value;
      const points = document.getElementById("megaGroupPoints").value;
      
      const btn = document.getElementById("megaGroupSubmitBtn");
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "جاري التحديث...";
      
      try {
        const res = await fetch("/supervisor/api/supervisor/mega-groups/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId, axis, points })
        });
        const data = await res.json();
        if (data.success) {
          alert("تم تحديث النقاط بنجاح!");
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

code = code.replace("document.addEventListener(\"DOMContentLoaded\", () => {", "document.addEventListener(\"DOMContentLoaded\", () => {\\n" + jsCode);

fs.writeFileSync("public/js/supervisor.js", code);
console.log("Updated supervisor.js");

