
const sessions = [];

// Mondays (from previous prompt)
sessions.push({ date: "2026-09-28", day: "الإثنين", week: 3 });
sessions.push({ date: "2026-10-12", day: "الإثنين", week: 5 });
sessions.push({ date: "2026-10-26", day: "الإثنين", week: 7 });
sessions.push({ date: "2026-11-09", day: "الإثنين", week: 9 });
sessions.push({ date: "2026-11-30", day: "الإثنين", week: 12 });
sessions.push({ date: "2026-12-14", day: "الإثنين", week: 14 });

// Thursdays starting 2026-09-10
let currDate = new Date("2026-09-10T00:00:00Z");
for (let i = 1; i <= 16; i++) {
  const d = currDate.toISOString().split("T")[0];
  sessions.push({ date: d, day: "الخميس", week: i });
  currDate.setDate(currDate.getDate() + 7);
}

sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

console.log("const sessionsToInsert = [");
sessions.forEach(s => {
  console.log(`  ["${s.date}", "${s.day}", ${s.week}],`);
});
console.log("];");
console.log("const requiredDates = [");
console.log(sessions.map(s => `"${s.date}"`).join(", "));
console.log("];");

