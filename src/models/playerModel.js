const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATEMENT = `
    SELECT player_id, name, rarity, power_value FROM BasketballPLayer;`;
    pool.query(SQLSTATEMENT, callback);
}