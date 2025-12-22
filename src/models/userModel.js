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

module.exports.selectPlayerByUser = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT
        p.player_id,
        p.name,
        p.rarity
      FROM UserRoster ur
      JOIN BasketballPlayer p
        ON ur.player_id = p.player_id
      WHERE ur.user_id = ?;

        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectTeamById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT t.slot, t.player_id, p.name
        FROM UserTeam t
        JOIN BasketballPlayer p
          ON t.player_id = p.player_id
        WHERE t.user_id = ?;
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateTeamById = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO UserTeam (user_id, slot, player_id)
    VALUES
    (?, 1, ?),
    (?, 2, ?),
    (?, 3, ?),
    (?, 4, ?),
    (?, 5, ?)
    ON DUPLICATE KEY UPDATE
    player_id = VALUES(player_id);
    `;
  const p = data.player_ids; // [p1,p2,p3,p4,p5]
  const VALUES = [
    data.user_id, p[0],
    data.user_id, p[1],
    data.user_id, p[2],
    data.user_id, p[3],
    data.user_id, p[4],
  ];

  pool.query(SQLSTATEMENT, VALUES, callback);
};