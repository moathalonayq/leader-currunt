const pool = require("../config/db");

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

module.exports = {
  getAllMegaGroups,
  addPointsToMegaGroup
};

