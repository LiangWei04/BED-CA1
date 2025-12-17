const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const challengeRoutes = require("./challengeRoutes");
const playerRoutes = require("./playerRoutes");
const bannerRoutes = require("./bannerRoutes");

router.use("/banners", bannerRoutes);
router.use("/players", playerRoutes);
router.use("/challenges", challengeRoutes);
router.use("/users", userRoutes);

module.exports = router;
