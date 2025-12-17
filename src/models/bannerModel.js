const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM SummonBanner;`;
  pool.query(SQLSTATEMENT, callback);
};


module.exports.selectBannerById = (data, callback) =>
{
    const SQLSTATEMENT = `
      SELECT * FROM SummonBanner 
      WHERE banner_id = ?;
        `;
    const VALUES = [data.banner_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectUserById = (data, callback) =>
{
    const SQLSTATEMENT = `
      SELECT * FROM User 
      WHERE user_id = ?;
        `;
    const VALUES = [data.user_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deductPointsById = (data, callback) =>
{
    const SQLSTATEMENT = `
      UPDATE User
      SET points = points - ?
      WHERE user_id = ?
        `;
    const VALUES = [data.bannerCost, data.user_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectPlayerByRandom = (data, callback) =>
{
    const SQLSTATEMENT = `
      select * FROM BasketballPlayer, user
      WHERE rarity = ?  AND user_id = ?
      ORDER BY RAND() LIMIT 1;
        `;
    const VALUES = [data.tierType, data.user_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}