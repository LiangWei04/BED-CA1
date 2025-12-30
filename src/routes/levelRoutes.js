const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');

router.get('/', levelController.readAll);
router.get('/:level_id/opponent', levelController.readLevelById);
router.post('/:level_id/play', levelController.checkLevel, levelController.checkUser, levelController.checkTeam, levelController.computePower, levelController.checkOpponentTeam, levelController.computeOpponentPower, levelController.simulation, levelController.finalizePlay);
module.exports = router;