const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const challengeRoutes = require("./challengeRoutes");
const playerRoutes = require("./playerRoutes");
const bannerRoutes = require("./bannerRoutes");
const levelRoutes = require("./levelRoutes");
const matchRoutes = require("./matchRoutes");

router.use("/matches", matchRoutes);
router.use("/levels", levelRoutes);
router.use("/banners", bannerRoutes);
router.use("/players", playerRoutes);
router.use("/challenges", challengeRoutes);
router.use("/users", userRoutes);

module.exports = router;
