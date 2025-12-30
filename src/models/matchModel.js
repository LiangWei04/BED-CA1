const pool = require("../services/db");

module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT * FROM MatchHistory
        WHERE user_id = ?;
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
