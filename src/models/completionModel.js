const pool = require("../services/db");

module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT * FROM UserCompletion
        WHERE challenge_id = ?;
        `;
  const VALUES = [data.challenge_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
  const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, details)
        VALUES (?, ?, ?);
        `;
  const VALUES = [data.challenge_id, data.user_id, data.details];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
