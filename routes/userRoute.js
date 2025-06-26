const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// Public route - đăng ký user mới
router.post('/', UserController.createUser);

// Protected routes - chỉ admin
router.get('/', authenticateToken, authorizeRole('admin'), UserController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRole('admin'), UserController.getUserById);
router.put('/:id', authenticateToken, authorizeRole('admin'), UserController.updateUser);
router.delete('/:id', authenticateToken, authorizeRole('admin'), UserController.deleteUser);

module.exports = router;