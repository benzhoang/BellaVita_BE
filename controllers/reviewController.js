const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

const ReviewsController = {
  // Lấy tất cả review theo product_id
  getByProductId: async (req, res) => {
    const { product_id } = req.params;
    try {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
      const reviews = await Review.findAll({ where: { product_id } });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getReviewById: async (req, res) => {
    const { id } = req.params;
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Review không tồn tại' });
      }
      res.json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Thêm review mới
  create: async (req, res) => {
    const { product_id, rating, comment } = req.body;
    const userId = req.user?.id;
    try {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
      }
      const newReview = await Review.create({ product_id, user_id: userId, rating, comment });
      res.status(201).json(newReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Sửa review (chỉ cho phép nếu là chủ sở hữu)
  update: async (req, res) => {
    const { review_id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;
    try {
      const review = await Review.findByPk(review_id);
      if (!review) {
        return res.status(404).json({ message: 'Review không tồn tại' });
      }
      if (review.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền sửa review này' });
      }
      await Review.update({ rating, comment }, { where: { review_id } });
      const updatedReview = await Review.findByPk(review_id);
      res.json(updatedReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa review (chỉ cho phép nếu là chủ sở hữu)
  delete: async (req, res) => {
    const { review_id } = req.params;
    const userId = req.user?.id;
    try {
      const review = await Review.findByPk(review_id);
      if (!review) {
        return res.status(404).json({ message: 'Review không tồn tại' });
      }
      if (review.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa review này' });
      }
      await Review.destroy({ where: { review_id } });
      res.json({ message: 'Đã xóa thành công' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ReviewsController;