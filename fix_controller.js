const fs = require("fs");
let code = fs.readFileSync("controllers/supervisorController.js", "utf8");

const methodHtml = `
exports.updateMegaGroupPoints = async (req, res) => {
  try {
    const { groupId, axis, points } = req.body;
    if (!groupId || !axis || points === undefined) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    await megaGroupModel.addPointsToMegaGroup(groupId, axis, parseInt(points, 10));
    res.json({ success: true });
  } catch (err) {
    console.error("updateMegaGroupPoints error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
`;

code = code + "\\n" + methodHtml;
fs.writeFileSync("controllers/supervisorController.js", code);
console.log("Updated supervisor controller");

