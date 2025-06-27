const User = require('./userModel');
const Category = require('./categoryModel');
const Product = require('./productModel');
const Cart = require('./cartModel');
const CartItem = require('./cartItemModel');
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');
const Payment = require('./paymentModel');
const Review = require('./reviewModel');
const InventoryAlert = require('./inventoryAlertModel');
const ChatbotSession = require('./chatBotSessionModel');
const AdminLog = require('./adminLogModel');
const Content = require('./contentModel');
const AdCampaign = require('./adCampaignModel');
const FinancialReport = require('./financialReportModel');

// User - Cart
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// User - Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// User - Review
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// User - ChatbotSession
User.hasMany(ChatbotSession, { foreignKey: 'user_id' });
ChatbotSession.belongsTo(User, { foreignKey: 'user_id' });

// User - AdminLog (admin_id)
User.hasMany(AdminLog, { foreignKey: 'admin_id' });
AdminLog.belongsTo(User, { foreignKey: 'admin_id' });

// Category - Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Product - Review
Product.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// Product - InventoryAlert
Product.hasMany(InventoryAlert, { foreignKey: 'product_id' });
InventoryAlert.belongsTo(Product, { foreignKey: 'product_id' });

// Product - CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Cart - CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Order - Payment
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = {
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Review,
  InventoryAlert,
  ChatbotSession,
  AdminLog,
  Content,
  AdCampaign,
  FinancialReport,
};