const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.readAll);

module.exports = router;
