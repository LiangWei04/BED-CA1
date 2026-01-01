// Handles player listing and basic player-related queries

const model = require("../models/playerModel");

// Return full player list (mainly for testing / admin view)
module.exports.readAllPlayers = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0)
        return res.status(404).json({ message: "No player found" });
      res.status(200).json(results);
    }
  };
  model.selectAll(callback);
};

// Fetch single player details by id
module.exports.readPlayerById = (req, res, next) => {
  const data = {
    player_id: req.params.player_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0)
        return res.status(404).json({ message: "Player not found" });
      res.status(200).json(results);
    }
  };
  model.selectById(data, callback);
};
