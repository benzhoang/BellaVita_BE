const express = require('express');
require('dotenv').config();
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
const sequelize = require('./configs/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute');
const cartRoutes = require('./routes/cartRoute');
const reviewRoutes = require('./routes/reviewRoute');
const adminLogRoute = require('./routes/adminLogRoute');
const authRoutes = require('./routes/authRoute');
const paymentRoutes = require('./routes/paymentRoute');
const adCampaignRoutes = require('./routes/adCampaignRoute');
const chatbotSessionRoutes = require('./routes/chatbotSessionRoute');
const contentRoutes = require('./routes/contentRoute');
const financialReportRoutes = require('./routes/financialReportRoute');
const inventoryAlertRoutes = require('./routes/inventoryAlertRoute');
const path = require('path');

// Thiết lập associations
// const models = require('./models/associations');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Cấu hình Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customJs: '/configs/swagger-custom.js'
}));
app.use('/configs/swagger-custom.js', express.static(path.join(__dirname, '/configs/swagger-custom.js')));
// Cấu hình các route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin-logs', adminLogRoute);
app.use('/api/payment', paymentRoutes);
app.use('/api/ad-campaigns', adCampaignRoutes);
app.use('/api/chatbot-sessions', chatbotSessionRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/financial-reports', financialReportRoutes);
app.use('/api/inventory-alerts', inventoryAlertRoutes);

// Route giới thiệu về BE server và link Swagger
app.get('/', (req, res) => {
  const host = req.headers.host;
  res.json({
    message: "💄 BellaVita Backend API Server. Chào mừng bạn đến với hệ thống API cho BellaVita.",
    swagger_docs: `http://${host}/api-docs`
  });
});
// Hàm kiểm tra associations
// function checkAssociations() {
//   Object.entries(models).forEach(([modelName, model]) => {
//     if (model.associations && Object.keys(model.associations).length > 0) {
//       console.log(`Model ${modelName} associations:`);
//       Object.entries(model.associations).forEach(([assocName, assocObj]) => {
//         console.log(
//           `  ${assocObj.associationType} -> ${assocObj.target.name} (as: ${assocObj.as || assocName})`
//         );
//       });
//     } else {
//       console.log(`Model ${modelName} has no associations.`);
//     }
//   });
// }

// Kiểm tra associations khi khởi động server
// checkAssociations();



// Đồng bộ DB (chỉ nên dùng khi phát triển)

sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    const domain =
      process.env.DOMAIN ||
      `http://localhost:${port}`;
    console.log(`🚀 Server chạy tại ${domain}`);
    console.log(`📚 API Docs: ${domain}/api-docs`);
  });
});