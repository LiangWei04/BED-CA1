const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM SummonBanner;`;
  pool.query(SQLSTATEMENT, callback);
};

module.exports.selectBannerById = (data, callback) => {
  const SQLSTATEMENT = `
      SELECT * FROM SummonBanner 
      WHERE banner_id = ?;
        `;
  const VALUES = [data.banner_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectUserById = (data, callback) => {
  const SQLSTATEMENT = `
      SELECT * FROM User 
      WHERE user_id = ?;
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deductPointsById = (data, callback) => {
  const SQLSTATEMENT = `
      UPDATE User
      SET points = points - ?
      WHERE user_id = ?;
      SELECT points 
      FROM User 
      WHERE user_id = ?;
        `;
  const VALUES = [data.bannerCost, data.user_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectPlayerByRandom = (data, callback) => {
  const SQLSTATEMENT = `
      SELECT bp.player_id, bp.name, bp.rarity
      FROM BannerPlayer bpr
      JOIN BasketballPlayer bp ON bp.player_id = bpr.player_id
      WHERE bpr.banner_id = ? AND bp.rarity = ?
      ORDER BY RAND()
      LIMIT 1
        `;
  const VALUES = [data.banner_id, data.tierType];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertPlayerUserRel = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO UserRoster (user_id, player_id, quantity)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE quantity = quantity + 1;
        `;
  const VALUES = [data.user_id, data.player_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

