// Handles PvE/PvP match logic and win/lose calculation

const model = require("../models/matchModel");

module.exports.readMatchById = (req, res, next) => {
  const data = {
    user_id: req.params.user_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readMatchById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Match not found",
        });
      } else res.status(200).json(results);
    }
  };
  model.selectById(data, callback);
};
