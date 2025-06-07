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
const orderItemRoutes = require('./routes/orderItemRoute');
const cartRoutes = require('./routes/cartRoute');
const cartItemRoutes = require('./routes/cartItemRoute');
const reviewRoutes = require('./routes/reviewRoute');
const adminLogRoute = require('./routes/adminLogRoute');
const authRoutes = require('./routes/authRoute');

// Thiết lập associations
// const models = require('./models/associations');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Cấu hình Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Cấu hình các route
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/order-items', orderItemRoutes);
app.use('/carts', cartRoutes);
app.use('/cart-items', cartItemRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin-logs', adminLogRoute);

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