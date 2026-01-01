const model = require("../models/levelModel");
const pool = require("../services/db");

module.exports.readAll = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllById:", error);
      res.status(500).json(error);
    } else {
      res.status(200).json(results);
    }
  };
  model.selectAll(callback);
};

module.exports.readLevelById = (req, res, next) => {
  const data = {
    id: req.params.level_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readLevelById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Level not found",
        });
      } else res.status(200).json(results);
    }
  };
  model.selectById(data, callback);
};

// Run a match and decide outcome based on power difference + randomness
module.exports.checkLevel = (req, res, next) => {
  const data = {
    id: req.params.level_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkLevel:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Level not found",
        });
      } else next();
    }
  };
  model.selectById(data, callback);
};

module.exports.checkUser = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
    level: req.params.level_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUser:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0)
        return res.status(404).json({ message: "User not found" });
      if (results[0].tickets < 1)
        return res.status(403).json({ message: "Insufficient ticket" });
      if (data.level > results[0].current_level)
        return res.status(403).json({ message: "Level not unlocked" });
      req.body.curLevel = results[0].current_level;
      next();
    }
  };
  model.selectUserById(data, callback);
};

module.exports.checkTeam = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkTeam:", error);
      res.status(500).json(error);
    } else {
      if (results.length != 5)
        return res.status(400).json({ message: "Team incomplete" });
      req.body.team = results;
      next();
    }
  };
  model.selectTeamById(data, callback);
};

module.exports.computePower = (req, res, next) => {
  const data = {
    team: req.body.team,
    user_id: req.body.user_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error computePower:", error);
      res.status(500).json(error);
    } else {
      let iniPower = data.team.reduce(
        (acc, cur) => (acc += Number(cur.power_value)),
        0
      );
      let buff = results.length ? results[0].buff_value : 1;
      req.body.teamPower = Math.floor(buff * iniPower);
      next();
    }
  };
  model.selectRuleById(data, callback);
};

module.exports.checkOpponentTeam = (req, res, next) => {
  const data = {
    level_id: req.params.level_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkOpponentTeam ", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0)
        return res.status(404).json({ message: "Level not found" });
      req.body.opponent = results;
      next();
    }
  };
  model.selectOpponentById(data, callback);
};

module.exports.computeOpponentPower = (req, res, next) => {
  const data = {
    opponent: req.body.opponent,
    level_id: req.params.level_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error computePower:", error);
      res.status(500).json(error);
    } else {
      let iniPower = data.opponent.reduce(
        (acc, cur) => (acc += Number(cur.power_value)),
        0
      );
      let buff = results.length ? results[0].buff_value : 1;
      req.body.opPower = Math.floor(buff * iniPower);
      next();
    }
  };
  model.selectRuleByLevel(data, callback);
};

// Higher power should usually win, but never 100% guaranteed
module.exports.simulation = (req, res, next) => {
  const data = {
    team: req.body.teamPower,
    opponent: req.body.opPower,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error some:", error);
      res.status(500).json(error);
    } else {
      let diff = data.team - data.opponent;
      let p = 1 / (1 + Math.exp(-diff / 10));
      let rand = Math.random();
      let winOrLose = rand < p ? "WIN" : "LOSE";
      const base = 70 + Math.floor(Math.random() * 30);
      const expectedMargin = diff / 4;
      const noise = Math.floor(Math.random() * 6) - 3;
      let user_score = 0;
      let opp_score = 0;
      if (winOrLose === "WIN") {
        const margin = Math.max(1, Math.floor(expectedMargin + noise));
        user_score = base + Math.ceil(margin / 2);
        opp_score = base - Math.floor(margin / 2);
      } else {
        const margin = Math.max(1, Math.floor(-expectedMargin + noise));
        user_score = base - Math.floor(margin / 2);
        opp_score = base + Math.ceil(margin / 2);
      }
      req.body.user_score = user_score;
      req.body.opp_score = opp_score;
      req.body.results = winOrLose;
      next();
    }
  };
  callback();
};

module.exports.finalizePlay = (req, res) => {
  const user_id = req.body.user_id;
  const level_id = Number(req.params.level_id);

  // These should be set earlier by your simulation middleware
  // (DON’T res.json in simulation; store and next())
  const result = req.body.results;
  const user_score = req.body.user_score;
  const opp_score = req.body.opp_score;
  const curLevel = req.body.curLevel;
  pool.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);

    conn.beginTransaction((err) => {
      if (err) {
        conn.release();
        return res.status(500).json(err);
      }

      // 1) Deduct ticket safely
      model.deductTicketTx(conn, { user_id }, (err, r1) => {
        if (err) return rollback(conn, res, err);

        if (r1.affectedRows !== 1) {
          return rollback(conn, res, { message: "Not enough tickets" }, 403);
        }

        // 2) Get level rewards
        model.selectLevelRewardsTx(conn, { level_id }, (err, lvlRows) => {
          if (err) return rollback(conn, res, err);
          if (lvlRows.length === 0)
            return rollback(conn, res, { message: "Level not found" }, 404);

          const first_clear_reward = lvlRows[0].first_clear_reward;
          const repeat_reward = lvlRows[0].repeat_reward;

          // 3) Insert match history with temp reward 0
          const mhData = {
            user_id,
            level_id,
            user_score,
            opp_score,
            result,
            reward_points: 0,
          };

          model.insertMatchHistoryTx(conn, mhData, (err, mhRes) => {
            if (err) return rollback(conn, res, err);

            const match_id = mhRes.insertId;
            let reward_points = 0;

            // 4) If lose: reward stays 0, finalize
            if (result !== "WIN") {
              return finalizeCommit(conn, res, {
                result,
                user_score,
                opponent_score: opp_score,
                reward_points,
                current_level: level_id,
                curLevel,
              });
            }

            // 5) WIN: check first clear vs repeat
            model.selectUserProgressTx(
              conn,
              { user_id, level_id },
              (err, progRows) => {
                if (err) return rollback(conn, res, err);

                const firstClear =
                  progRows.length === 0 || progRows[0].cleared === 0;

                if (firstClear) {
                  reward_points = first_clear_reward;

                  // mark cleared
                  model.upsertProgressClearedTx(
                    conn,
                    { user_id, level_id },
                    (err) => {
                      if (err) return rollback(conn, res, err);

                      // unlock next level
                      model.unlockNextLevelTx(
                        conn,
                        { user_id, next_level: level_id + 1 },
                        (err) => {
                          if (err) return rollback(conn, res, err);

                          // add points
                          model.addPointsTx(
                            conn,
                            { user_id, points: reward_points },
                            (err) => {
                              if (err) return rollback(conn, res, err);

                              // update match reward
                              model.updateMatchRewardTx(
                                conn,
                                { match_id, reward_points },
                                (err) => {
                                  if (err) return rollback(conn, res, err);

                                  return finalizeCommit(conn, res, {
                                    result,
                                    user_score,
                                    opponent_score: opp_score,
                                    reward_points,
                                    current_level: level_id,
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                } else {
                  // repeat win: increment daily and compute diminishing
                  model.incrementDailyRepeatWinTx(
                    conn,
                    { user_id, level_id },
                    (err) => {
                      if (err) return rollback(conn, res, err);

                      model.selectTodayRepeatCountTx(
                        conn,
                        { user_id, level_id },
                        (err, dailyRows) => {
                          if (err) return rollback(conn, res, err);

                          const c = dailyRows[0].repeat_wins_count;
                          const mult =
                            c === 1 ? 1.0 : c === 2 ? 0.7 : c === 3 ? 0.4 : 0.0;
                          reward_points = Math.floor(repeat_reward * mult);

                          // add points (if any)
                          if (reward_points <= 0) {
                            // still update match reward to 0 and commit
                            return model.updateMatchRewardTx(
                              conn,
                              { match_id, reward_points: 0 },
                              (err) => {
                                if (err) return rollback(conn, res, err);
                                return finalizeCommit(conn, res, {
                                  result,
                                  user_score,
                                  opponent_score: opp_score,
                                  reward_points: 0,
                                  current_level: level_id,
                                });
                              }
                            );
                          }

                          model.addPointsTx(
                            conn,
                            { user_id, points: reward_points },
                            (err) => {
                              if (err) return rollback(conn, res, err);

                              model.updateMatchRewardTx(
                                conn,
                                { match_id, reward_points },
                                (err) => {
                                  if (err) return rollback(conn, res, err);

                                  return finalizeCommit(conn, res, {
                                    result,
                                    user_score,
                                    opponent_score: opp_score,
                                    reward_points,
                                    current_level: level_id,
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
          });
        });
      });
    });
  });
};

// helpers (keep them in the same controller file)
function rollback(conn, res, error, status = 500) {
  conn.rollback(() => {
    conn.release();
    return res.status(status).json(error);
  });
}

function finalizeCommit(conn, res, payload) {
  conn.commit((err) => {
    if (err) return rollback(conn, res, err);
    conn.release();
    return res.status(200).json(payload);
  });
}
