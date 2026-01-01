const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.readAllPlayers);
router.get('/:player_id', playerController.readPlayerById);

module.exports = router;
