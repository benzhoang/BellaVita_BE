const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', ReviewController.getByProductId);
router.get('/:id', ReviewController.getReviewById);
router.post('/', authenticateToken, ReviewController.create);
router.put('/:id', authenticateToken, ReviewController.update);
router.delete('/:id', authenticateToken, ReviewController.delete);

module.exports = router;