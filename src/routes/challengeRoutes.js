const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");
const completionController = require("../controllers/completionController");

router.get("/", challengeController.readAll);

router.post("/", challengeController.createChallenge);
router.put("/:challenge_id", challengeController.updateChallengeById);
router.delete("/:challenge_id", challengeController.deleteChallengeById);

router.get("/:challenge_id", completionController.readCompletionById);
router.post("/:challenge_id", completionController.createCompletion);
module.exports = router;
