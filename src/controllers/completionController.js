const model = require("../models/completionModel");

module.exports.readCompletionById = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readCompletionById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "task not found",
        });
      } else res.status(200).json(results);
    }
  };
  model.selectById(data, callback);
};

module.exports.createCompletion = (req, res, next) => {
  if (req.body == undefined) {
    res.status(400).json({ message: "Missing required data." });
    return;
  }
  if (
    req.params.challenge_id == undefined ||
    req.body.user_id == undefined ||
    req.body.details == undefined
  ) {
    res.status(400).send("Missing required data");
    return;
  }
  const data = {
    challenge_id: req.params.challenge_id,
    user_id: req.body.user_id,
    details: req.body.details,
  };
  const callback = (error, results, fields) => {
    if (error) {
      if (error.code == "ER_NO_REFERENCED_ROW_2" || error.errno == 1452) {
        return res
          .status(404)
          .json({ message: "user_id or challenge_id does not exist" });
      }
      console.error("Error createCompletion:", error);
      res.status(500).json(error);
    } else {
      res.status(201).json({
        complete_id: results.insertId,
        challenge_id: data.challenge_id,
        user_id: data.user_id,
        details: data.details,
      });
    }
  };
  model.insertSingle(data, callback);
};
