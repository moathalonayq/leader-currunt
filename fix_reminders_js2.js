const fs = require("fs");
let code = fs.readFileSync("views/weekly-reminders.ejs", "utf8");

const start = code.indexOf("const selectAll = document.getElementById");
const end = code.indexOf("</script>");
if (start > -1 && end > -1) {
  let newJs = `  const selectAll = document.getElementById("selectAllReminders");
  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      document.querySelectorAll(".reminder-cb").forEach(cb => cb.checked = e.target.checked);
    });
  }

  const sendSelectedBtn = document.getElementById("sendSelectedBtn");
  if (sendSelectedBtn) {
    sendSelectedBtn.addEventListener("click", async () => {
      const selectedCb = Array.from(document.querySelectorAll(".reminder-cb:checked"));
      if (selectedCb.length === 0) {
        alert("الرجاء تحديد طالب واحد على الأقل");
        return;
      }
      
      const studentIds = selectedCb.map(cb => Number(cb.value));

      if (!confirm("سيتم إرسال رسالة تذكير للطلاب المحددين (" + studentIds.length + " طالب). متأكد؟")) return;
      
      sendSelectedBtn.disabled = true;
      sendSelectedBtn.textContent = "جاري الإرسال للمحددين...";
      const msg = document.getElementById("sendAllMsg");
      try {
        const res = await fetch("/api/supervisor/weekly-reminders/send-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weekNumber, studentIds }),
        });
        const data = await res.json();
        if (!data.success) {
          msg.className = "form-msg error";
          msg.textContent = data.message || "حدث خطأ";
        } else {
          msg.className = "form-msg success";
          msg.textContent = \`تم الإرسال لـ \${data.sent} طالب بنجاح. (\${data.failed.length} فشل)\`;
          if (data.failed.length > 0) {
            console.log("Failed:", data.failed);
          }
        }
      } catch (e) {
        msg.className = "form-msg error";
        msg.textContent = "حدث خطأ في الاتصال بالخادم";
      } finally {
        sendSelectedBtn.disabled = false;
        sendSelectedBtn.textContent = "🚀 إرسال للمحددين فقط";
      }
    });
  }
`;
  code = code.substring(0, start) + newJs + code.substring(end);
  fs.writeFileSync("views/weekly-reminders.ejs", code);
  console.log("Cleaned up bottom of JS");
}

