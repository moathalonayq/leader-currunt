const fs = require("fs");
let code = fs.readFileSync("models/megaGroupModel.js", "utf8");

code = code.replace(
  `const pool = require("../config/db");`,
  `const pool = require("../config/db");\nconst groupModel = require("./groupModel");`
);

const newMethods = `
const assignGroupToMegaGroup = async (groupId, megaGroupId) => {
  await pool.query("UPDATE \\\`groups\\\` SET mega_group_id = ? WHERE id = ?", [megaGroupId || null, groupId]);
};

const getMegaGroupDetails = async () => {
  // Get all mega groups
  const [mgs] = await pool.query(\`
    SELECT 
      id, name, cultural_points, sports_points, audience_points,
      (cultural_points + sports_points + audience_points) AS total_points
    FROM mega_groups
    ORDER BY total_points DESC, name ASC
  \`);
  
  // Get all groups with their mega_group_id
  const [groups] = await pool.query("SELECT id, name, mega_group_id FROM \\\`groups\\\` WHERE mega_group_id IS NOT NULL");
  
  // Get all students
  const [students] = await pool.query("SELECT id, name, group_id FROM students");
  
  for (const mg of mgs) {
    mg.usras = groups.filter(g => g.mega_group_id === mg.id).map(g => {
      return {
        id: g.id,
        name: g.name,
        students: students.filter(s => s.group_id === g.id)
      };
    });
  }
  
  return mgs;
};
`;

code = code.replace(
  "module.exports = {",
  newMethods + "\nmodule.exports = {\n  assignGroupToMegaGroup,\n  getMegaGroupDetails,"
);

fs.writeFileSync("models/megaGroupModel.js", code);
console.log("Updated megaGroupModel");

