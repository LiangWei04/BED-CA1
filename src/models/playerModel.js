const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT player_id, name, rarity, power_value FROM BasketballPLayer;`;
  pool.query(SQLSTATEMENT, callback);
};


module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT player_id, name, rarity, power_value FROM BasketballPLayer WHERE player_id = ?;`;
  const VALUES = [data.player_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};