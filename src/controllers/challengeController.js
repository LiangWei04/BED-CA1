// Handles wellness challenge creation, updates, and deletion

const model = require("../models/challengeModel");

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

// Create a new challenge under a specific user (creator)
module.exports.createChallenge = (req, res, next) => {
  if (req.body == undefined) {
    res.status(400).json({ message: "Missing required data." });
    return;
  }
  if (
    req.body.description == undefined ||
    req.body.user_id == undefined ||
    req.body.points == undefined
  ) {
    res.status(400).json({ message: "Missing required data" });
    return;
  }
  const data = {
    description: req.body.description,
    user_id: req.body.user_id,
    points: req.body.points,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createChallenge:", error);
      res.status(500).json(error);
    } else {
      res.status(201).json({
        challenge_id: results.insertId,
        description: data.description,
        creator_id: data.user_id,
        points: data.points,
      });
    }
  };
  model.insertSingle(data, callback);
};

// Only allow creator to update their own challenge
module.exports.updateChallengeById = (req, res, next) => {
  if (req.body == undefined) {
    res.status(400).json({ message: "Missing required data." });
    return;
  }
  if (
    req.body.description == undefined ||
    req.body.user_id == undefined ||
    req.body.points == undefined ||
    req.params.challenge_id == undefined
  ) {
    res.status(400).json({ message: "Missing required data." });
    return;
  }
  const data = {
    description: req.body.description,
    user_id: req.body.user_id,
    points: req.body.points,
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updateChallengeById:", error);
      res.status(500).json(error);
    } else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "Challenge not found",
        });
      } else {
        res.status(200).json({
          challenge_id: data.challenge_id,
          description: data.description,
          creator_id: data.user_id,
          points: data.points,
        });
      }
    }
  };
  model.updateChallengeById(data, callback);
};

// Delete challenge and rely on DB cascade to clean up completions
module.exports.deleteChallengeById = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteChallengeById:", error);
      res.status(500).json(error);
    } else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "Challenge not found",
        });
      } else res.status(204).send();
    }
  };
  model.deleteChallengeById(data, callback);
};
