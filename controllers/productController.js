const Product = require('../models/productModel');

const ProductController = {
  // Lấy tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy sản phẩm theo id
  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      await product.update(req.body);
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Kiểm tra sản phẩm có liên quan đến các bảng khác không (order_items, cart_items, reviews)
      const OrderItem = require('../models/orderItemModel');
      const CartItem = require('../models/cartItemModel');
      const Review = require('../models/reviewModel');

      const hasOrderItem = await OrderItem.findOne({ where: { product_id: product.product_id } });
      const hasCartItem = await CartItem.findOne({ where: { product_id: product.product_id } });
      const hasReview = await Review.findOne({ where: { product_id: product.product_id } });

      if (hasOrderItem || hasCartItem || hasReview) {
        return res.status(400).json({ error: 'Không thể xóa sản phẩm vì còn liên kết với dữ liệu khác (đơn hàng, giỏ hàng, đánh giá, ...)' });
      }

      await product.destroy();
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ProductController;