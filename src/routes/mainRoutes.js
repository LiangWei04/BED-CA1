const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const challengeRoutes = require("./challengeRoutes");

router.use("/challenges", challengeRoutes);
router.use("/users", userRoutes);

module.exports = router;
