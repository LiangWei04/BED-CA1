const model = require("../models/playerModel");

module.exports.readAll = (req, res, next) => {
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
