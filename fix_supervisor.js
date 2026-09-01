const fs = require("fs");
let code = fs.readFileSync("public/js/supervisor.js", "utf8");

code = code.replace(
  `setupGroupStudentPicker("initiativeGroupPicker", "initiativeStudentPicker", "initiativeStudentSelect", students);`,
  `setupGroupStudentPicker("initiativeGroupPicker", "initiativeStudentPicker", "initiativeStudentSelect", students);\n  setupGroupStudentPicker("catPointsGroupPicker", "catPointsStudentPicker", "catPointsStudentSelect", students);`
);

let formCode = `
/* =========================================================
   Update Cultural/Sports Points Form
   ========================================================= */
function setupCatPointsForm() {
  const btn = document.getElementById("updateCatPointsBtn");
  const msg = document.getElementById("catPointsMsg");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const studentId = document.getElementById("catPointsStudentSelect").value;
    const category = document.getElementById("catPointsCategory").value;
    const points = document.getElementById("catPointsAmount").value;

    if (!studentId) {
      showMsg(msg, "الرجاء اختيار الطالب", "error");
      return;
    }
    if (!category) {
      showMsg(msg, "الرجاء اختيار البرنامج", "error");
      return;
    }

    btn.disabled = true;
    try {
      const res = await fetch("/api/supervisor/category-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, category, points: Number(points) })
      });
      if (res.ok) {
        showMsg(msg, "تم التحديث بنجاح", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        showMsg(msg, "حدث خطأ أثناء التحديث", "error");
      }
    } catch (e) {
      showMsg(msg, "حدث خطأ في الاتصال بالخادم", "error");
    } finally {
      btn.disabled = false;
    }
  });
}
`;

code = code.replace("function setupPointsForm() {", formCode + "\nfunction setupPointsForm() {");

code = code.replace(
  "setupPointsForm();",
  "setupPointsForm();\n  setupCatPointsForm();"
);

fs.writeFileSync("public/js/supervisor.js", code);
console.log("Fixed supervisor.js");

