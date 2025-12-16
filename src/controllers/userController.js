const model = require("../models/userModel");

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

module.exports.readAllp = (req, res, next) => {
  let data = {
    username: req.body.username,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllById:", error);
      res.status(500).json(error);
    } else {
      let name = results.some((i) => i.username == data.username);
      if (name) {
        return res
          .status(409)
          .json({ message: "Duplicate username is not allowed!" });
      }
      next();
    }
  };
  model.selectAll(callback);
};

module.exports.readUserById = (req, res, next) => {
  const data = {
    user_id: req.params.user_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readUserById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "User not found",
        });
      } else res.status(200).json(results);
    }
  };
  model.selectById(data, callback);
};

module.exports.createUser = (req, res, next) => {
  if (req.body == undefined) {
    res.status(400).json({ message: "Missing required data." });
    return;
  }
  if (req.body.username == undefined) {
    res.status(400).send("Error: username is undefined");
    return;
  }
  const data = {
    username: req.body.username,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createUser:", error);
      res.status(500).json(error);
    } else {
      res.status(201).json({
        message: "User created!",
        user_id: results.insertId,
      });
    }
  };
  model.insertSingle(data, callback);
};

module.exports.updateUserById = (req, res, next) => {
  if (
    req.body.username == undefined ||
    req.body.points == undefined ||
    req.body.tickets == undefined
  ) {
    res
      .status(400)
      .send("Error: a or username or points or tickets is undefined");
    return;
  }
  const data = {
    user_id: req.params.user_id,
    username: req.body.username,
    points: req.body.points,
    tickets: req.body.tickets,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updateUserById:", error);
      res.status(500).json(error);
    } else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json({ message: "User updated!" });
      }
    }
  };
  model.updateUserById(data, callback);
};

module.exports.deleteUserById = (req, res, next) => {
  const data = {
    user_id: req.params.user_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteUserById:", error);
      res.status(500).json(error);
    } else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "User not found",
        });
      } else res.status(204).send();
    }
  };
  model.deleteUserById(data, callback);
};
