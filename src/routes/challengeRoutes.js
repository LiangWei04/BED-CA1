const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.get('/', challengeController.readAll);

router.post('/', challengeController.createChallenge);
router.put('/:challenge_id', challengeController.updateChallengeById);
router.delete('/:challenge_id', challengeController.deleteChallengeById);

module.exports = router;
