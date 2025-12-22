const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.get('/', bannerController.readAll);
router.post('/summon', bannerController.summonBannerActive, bannerController.getUserById, bannerController.getPlayerRandom, bannerController.establishRel);

module.exports = router;