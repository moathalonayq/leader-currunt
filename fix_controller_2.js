const fs = require("fs");
let code = fs.readFileSync("controllers/supervisorController.js", "utf8");

const newMethod = `
module.exports.assignMegaGroup = async (req, res) => {
  try {
    const { groupId, megaGroupId } = req.body;
    if (!groupId) {
      return res.status(400).json({ success: false, error: "Missing group id" });
    }
    await megaGroupModel.assignGroupToMegaGroup(groupId, megaGroupId || null);
    res.json({ success: true });
  } catch (err) {
    console.error("assignMegaGroup error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
`;

code = code + "\\n" + newMethod;
fs.writeFileSync("controllers/supervisorController.js", code);

