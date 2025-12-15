const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.readAll);
router.get('/:id', userController.readUserById);

router.post('/', userController.readAllp, userController.createUser);
router.put('/:id', userController.readAllp, userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
