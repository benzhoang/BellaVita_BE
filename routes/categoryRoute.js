const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', authenticateToken, authorizeRole('admin'), CategoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRole('admin'), CategoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('admin'), CategoryController.deleteCategory);

module.exports = router;