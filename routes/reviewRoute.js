const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.post('/', authenticateToken, ReviewController.createReview);
router.put('/:id', authenticateToken, ReviewController.updateReview);
router.delete('/:id', authenticateToken, ReviewController.deleteReview);

module.exports = router;