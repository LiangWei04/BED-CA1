const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/:user_id', matchController.readMatchById);

module.exports = router;