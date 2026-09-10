const pool = require("../config/db");
const groupModel = require("./groupModel");

const getAllMegaGroups = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id, 
      name, 
      cultural_points, 
      sports_points, 
      audience_points,
      (cultural_points + sports_points + audience_points) AS total_points
    FROM mega_groups
    ORDER BY total_points DESC, name ASC
  `);
  return rows;
};

const addPointsToMegaGroup = async (groupId, axis, points) => {
  let column = "";
  if (axis === "cultural") column = "cultural_points";
  else if (axis === "sports") column = "sports_points";
  else if (axis === "audience") column = "audience_points";
  else throw new Error("Invalid axis");

  await pool.query(
    `UPDATE mega_groups SET ${column} = ${column} + ? WHERE id = ?`,
    [points, groupId]
  );
};


const assignStudentToMegaGroup = async (studentId, megaGroupId) => {
  await pool.query("UPDATE students SET mega_group_id = ? WHERE id = ?", [megaGroupId || null, studentId]);
};

const assignGroupToMegaGroup = async (groupId, megaGroupId) => {
  await pool.query("UPDATE \`groups\` SET mega_group_id = ? WHERE id = ?", [megaGroupId || null, groupId]);
};

const getMegaGroupDetails = async () => {
  const [mgs] = await pool.query(`
    SELECT 
      id, name, cultural_points, sports_points, audience_points,
      (cultural_points + sports_points + audience_points) AS total_points
    FROM mega_groups
    ORDER BY total_points DESC, name ASC
  `);
  
  const [students] = await pool.query("SELECT id, name, group_id, mega_group_id FROM students WHERE mega_group_id IS NOT NULL");
  const [groups] = await pool.query("SELECT id, name FROM `groups`");

  for (const mg of mgs) {
    const mgStudents = students.filter(s => s.mega_group_id == mg.id);
    const grouped = {};
    for (const s of mgStudents) {
      if (!grouped[s.group_id]) grouped[s.group_id] = [];
      grouped[s.group_id].push(s);
    }
    mg.usras = Object.keys(grouped).map(gid => {
      const g = groups.find(x => x.id == gid);
      return {
        id: gid,
        name: g ? g.name : 'أخرى',
        students: grouped[gid]
      };
    });
  }
  return mgs;
};


const createMegaGroup = async (name) => {
  await pool.query('INSERT INTO mega_groups (name) VALUES (?)', [name]);
};

const deleteMegaGroup = async (id) => {
  await pool.query('DELETE FROM mega_groups WHERE id = ?', [id]);
};

const renameMegaGroup = async (id, newName) => {
  await pool.query('UPDATE mega_groups SET name = ? WHERE id = ?', [newName, id]);
};

module.exports = {
  createMegaGroup,
  deleteMegaGroup,
  renameMegaGroup,
  assignGroupToMegaGroup,
  assignStudentToMegaGroup,
  getMegaGroupDetails,
  getAllMegaGroups,
  addPointsToMegaGroup
};

