const Review = require('../models/reviewModel');

const ReviewController = {
  // Lấy tất cả review
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.findAll();
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy review theo id
  getReviewById: async (req, res) => {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo review mới
  createReview: async (req, res) => {
    try {
      const review = await Review.create(req.body);
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật review
  updateReview: async (req, res) => {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      await review.update(req.body);
      res.json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa review
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      await review.destroy();
      res.json({ message: 'Review deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ReviewController;