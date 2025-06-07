const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, authorizeRole('admin'), UserController.getAllUsers);
router.get('/:id', authenticateToken, UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', authenticateToken, authorizeRole('admin'), UserController.updateUser);
router.delete('/:id', authenticateToken, authorizeRole('admin'), UserController.deleteUser);

module.exports = router;