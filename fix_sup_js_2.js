const fs = require("fs");
let code = fs.readFileSync("public/js/supervisor.js", "utf8");

// Fix assign URL
code = code.replace(
  "fetch(\"/supervisor/api/supervisor/mega-groups/assign\"",
  "fetch(\"/api/supervisor/mega-groups/assign\""
);

// We need to replace the logic of setupCatPoints.
const oldCatPointsFunctionRegex = /function setupCatPoints\(\) \{[\s\S]*?\}\n/g;

const newCatPointsFunction = `function setupCatPoints() {
  const btn = document.getElementById("updateCatPointsBtn");
  const msg = document.getElementById("catPointsMsg");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const groupId = document.getElementById("catPointsMegaGroupSelect").value;
    const category = document.getElementById("catPointsCategory").value;
    const points = document.getElementById("catPointsAmount").value;

    if (!groupId) {
      showMsg(msg, "الرجاء اختيار المجموعة الكبرى", "error");
      return;
    }
    if (!category) {
      showMsg(msg, "الرجاء اختيار البرنامج", "error");
      return;
    }

    btn.disabled = true;
    try {
      const res = await fetch("/api/supervisor/mega-groups/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, axis: category, points })
      });
      const data = await res.json();

      if (data.success) {
        showMsg(msg, "تم تحديث النقاط بنجاح!", "success");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showMsg(msg, data.error || "حدث خطأ غير معروف", "error");
      }
    } catch (err) {
      console.error(err);
      showMsg(msg, "حدث خطأ في الاتصال بالخادم", "error");
    } finally {
      btn.disabled = false;
    }
  });
}
`;

code = code.replace(oldCatPointsFunctionRegex, newCatPointsFunction);
fs.writeFileSync("public/js/supervisor.js", code);
console.log("Updated supervisor.js catPoints");

