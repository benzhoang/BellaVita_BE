const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// Public routes - không cần đăng nhập để xem sản phẩm
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes - cần đăng nhập và quyền manager để quản lý
router.post('/', authenticateToken, authorizeRole('manager'), ProductController.createProduct);
router.put('/:id', authenticateToken, authorizeRole('manager'), ProductController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('manager'), ProductController.deleteProduct);

module.exports = router;