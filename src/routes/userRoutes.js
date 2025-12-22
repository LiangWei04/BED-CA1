const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.readAll);
router.get("/:user_id", userController.readUserById);
router.get("/:user_id/roster", userController.readPlayerUserRel);
router.get("/:user_id/team", userController.readTeamById);

router.post("/", userController.readAllp, userController.createUser);
router.put("/:user_id", userController.readAllp, userController.updateUserById);
router.put("/:user_id/team", userController.updateTeamById);
router.delete("/:user_id", userController.deleteUserById);

module.exports = router;
