const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM level;`;
  pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT slot, l.player_id, p.name
        FROM LevelOpponent l
        JOIN BasketballPlayer p
        ON l.player_id = p.player_id
        WHERE l.level_id = ?
        `;
  const VALUES = [data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectUserById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT tickets, current_level 
        FROM User
        WHERE user_id = ? 
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectTeamById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT ut.slot, bp.player_id, bp.power_value, bp.archetype, bp.era
        FROM UserTeam ut
        JOIN BasketballPlayer bp ON bp.player_id = ut.player_id
        WHERE ut.user_id = ?
        ORDER BY ut.slot;
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectOpponentById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT op.slot, bp.player_id, bp.power_value, bp.archetype, bp.era
        FROM LevelOpponent op
        JOIN BasketballPlayer bp ON bp.player_id = op.player_id
        WHERE op.level_id = ?
        ORDER BY op.slot;
        `;
  const VALUES = [data.level_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectRuleById = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT r.rule_id, r.name, r.buff_value
        FROM SynergyRule r
        JOIN SynergyRuleMember m ON m.rule_id = r.rule_id
        LEFT JOIN UserTeam ut
        ON ut.user_id = ? AND ut.player_id = m.player_id
        GROUP BY r.rule_id, r.name, r.buff_value
        HAVING SUM(ut.player_id IS NOT NULL) = COUNT(*);
        `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectRuleByLevel = (data, callback) => {
  const SQLSTATEMENT = `
        SELECT r.rule_id, r.name, r.buff_value
        FROM SynergyRule r
        JOIN SynergyRuleMember m ON m.rule_id = r.rule_id
        LEFT JOIN LevelOpponent op
        ON op.level_id = ? AND op.player_id = m.player_id
        GROUP BY r.rule_id, r.name, r.buff_value
        HAVING SUM(op.player_id IS NOT NULL) = COUNT(*);
        `;
  const VALUES = [data.level_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deductTicketTx = (conn, data, callback) => {
  const SQL = `UPDATE User SET tickets = tickets - 1
               WHERE user_id = ? AND tickets >= 1`;
  conn.query(SQL, [data.user_id], callback);
};

module.exports.selectLevelRewardsTx = (conn, data, callback) => {
  const SQL = `SELECT first_clear_reward, repeat_reward
               FROM Level WHERE level_id = ?`;
  conn.query(SQL, [data.level_id], callback);
};

module.exports.insertMatchHistoryTx = (conn, data, callback) => {
  const SQL = `INSERT INTO MatchHistory (user_id, level_id, user_score, opp_score, result, reward_points)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const VALUES = [
    data.user_id,
    data.level_id,
    data.user_score,
    data.opp_score,
    data.result,
    data.reward_points,
  ];
  conn.query(SQL, VALUES, callback);
};

module.exports.selectUserProgressTx = (conn, data, callback) => {
  const SQL = `SELECT cleared FROM UserLevelProgress
               WHERE user_id = ? AND level_id = ?`;
  conn.query(SQL, [data.user_id, data.level_id], callback);
};

module.exports.upsertProgressClearedTx = (conn, data, callback) => {
  const SQL = `
    INSERT INTO UserLevelProgress (user_id, level_id, cleared, cleared_at)
    VALUES (?, ?, 1, NOW())
    ON DUPLICATE KEY UPDATE
      cleared = 1,
      cleared_at = IF(cleared = 0, NOW(), cleared_at)
  `;
  conn.query(SQL, [data.user_id, data.level_id], callback);
};

module.exports.incrementDailyRepeatWinTx = (conn, data, callback) => {
  const SQL = `
    INSERT INTO UserLevelDaily (user_id, level_id, play_date, repeat_wins_count, loss_claimed)
    VALUES (?, ?, CURDATE(), 1, 0)
    ON DUPLICATE KEY UPDATE
      repeat_wins_count = repeat_wins_count + 1
  `;
  conn.query(SQL, [data.user_id, data.level_id], callback);
};

module.exports.selectTodayRepeatCountTx = (conn, data, callback) => {
  const SQL = `
    SELECT repeat_wins_count
    FROM UserLevelDaily
    WHERE user_id = ? AND level_id = ? AND play_date = CURDATE()
  `;
  conn.query(SQL, [data.user_id, data.level_id], callback);
};

module.exports.addPointsTx = (conn, data, callback) => {
  const SQL = `UPDATE User SET points = points + ? WHERE user_id = ?`;
  conn.query(SQL, [data.points, data.user_id], callback);
};

module.exports.unlockNextLevelTx = (conn, data, callback) => {
  const SQL = `UPDATE User
               SET current_level = GREATEST(current_level, ?)
               WHERE user_id = ?`;
  conn.query(SQL, [data.next_level, data.user_id], callback);
};

module.exports.updateMatchRewardTx = (conn, data, callback) => {
  const SQL = `UPDATE MatchHistory SET reward_points = ? WHERE match_id = ?`;
  conn.query(SQL, [data.reward_points, data.match_id], callback);
};
