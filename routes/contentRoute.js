const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/contentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// Public routes
router.get('/', ContentController.getAllContents);
router.get('/:id', ContentController.getContentById);

// Admin-only routes
router.post('/', authenticateToken, authorizeRole('admin'), ContentController.createContent);
router.put('/:id', authenticateToken, authorizeRole('admin'), ContentController.updateContent);
router.delete('/:id', authenticateToken, authorizeRole('admin'), ContentController.deleteContent);

module.exports = router; 