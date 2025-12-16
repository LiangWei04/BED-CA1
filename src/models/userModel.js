const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM User;`;
  pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
  const SQLSTATEMENT = `
        INSERT INTO User (username)
        VALUES (?);
        `;
  const VALUES = [data.username];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateUserById = (data, callback) => {
  const SQLSTATEMENT = `
        UPDATE User 
        SET username = ?, points = ?, tickets = ?
        WHERE user_id = ?;
        `;
  const VALUES = [data.username, data.points, data.tickets, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteUserById = (data, callback) => {
  const SQLSTATEMENT = `
        DELETE FROM User 
        WHERE user_id = ?;`;
  VALUES = [data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
