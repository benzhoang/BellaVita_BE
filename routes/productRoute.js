const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authenticateToken, authorizeRole('manager'), ProductController.createProduct);
router.put('/:id', authenticateToken, authorizeRole('manager'), ProductController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('manager'), ProductController.deleteProduct);

module.exports = router;