# VNPAY Payment Integration - BellaVita Backend

## 📋 Tổng Quan
Tích hợp cổng thanh toán VNPAY vào hệ thống BellaVita với đầy đủ quy trình từ tạo order đến xử lý thanh toán.

## 🏗️ Cấu Trúc Files

### Controllers
- `controllers/paymentController.js` - Xử lý thanh toán VNPAY
- `controllers/orderController.js` - Xử lý đơn hàng

### Routes
- `routes/paymentRoute.js` - API routes cho payment
- `routes/orderRoute.js` - API routes cho order

### Models
- `models/paymentModel.js` - Model cho payment
- `models/orderModel.js` - Model cho order
- `models/orderItemModel.js` - Model cho order items

### Testing Files
- `Complete_Payment_Flow_Postman.json` - Postman collection
- `calculate-hash.js` - Script tính toán hash
- `test-complete-flow.js` - Script test tự động
- `Complete_Testing_Guide.md` - Hướng dẫn test chi tiết

## 🚀 Cài Đặt và Cấu Hình

### 1. Environment Variables
Tạo file `.env` với các biến sau:
```env
# VNPAY Configuration
VNPAY_TMN_CODE=your_tmn_code_here
VNPAY_HASH_SECRET=your_hash_secret_here
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/payment/vnpay_return

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 2. Dependencies
```bash
npm install crypto moment querystring
```

### 3. Database Migration
Đảm bảo các bảng sau đã được tạo:
- `orders`
- `order_items`
- `payments`

## 🔄 Quy Trình Thanh Toán

### 1. Tạo Order
```javascript
POST /api/orders
{
  "user_id": 1,
  "status": false,
  "payment_method": "VNPAY",
  "total_amount": 100000
}
```

### 2. Thêm Order Items
```javascript
POST /api/orders/{orderId}/order-items
{
  "product_id": 1,
  "quantity": 2,
  "price": 50000
}
```

### 3. Tạo Payment URL
```javascript
POST /api/payment/create_payment_url
{
  "orderId": "1",
  "amount": 100000,
  "bankCode": "VNPAYQR",
  "orderDescription": "Thanh toan don hang 1",
  "orderType": "billpayment",
  "language": "vn"
}
```

### 4. VNPAY Callback
```
GET /api/payment/vnpay_return?vnp_Amount=10000000&vnp_ResponseCode=00&...
```

## 🧪 Testing

### Phương Pháp 1: Postman Collection
1. Import `Complete_Payment_Flow_Postman.json`
2. Cập nhật environment variables
3. Chạy từng request theo thứ tự

### Phương Pháp 2: Automated Script
```bash
node test-complete-flow.js
```

### Phương Pháp 3: Manual Testing
1. Chạy từng API endpoint
2. Sử dụng `calculate-hash.js` để tạo test URL
3. Test callback manually

## 📊 API Endpoints

### Payment Endpoints
- `GET /api/payment` - Lấy tất cả payments
- `GET /api/payment/:id` - Lấy payment theo ID
- `POST /api/payment/create_payment_url` - Tạo URL thanh toán
- `GET /api/payment/vnpay_return` - Callback từ VNPAY

### Order Endpoints
- `GET /api/orders` - Lấy tất cả orders
- `GET /api/orders/:id` - Lấy order theo ID
- `POST /api/orders` - Tạo order mới
- `PUT /api/orders/:id` - Cập nhật order
- `DELETE /api/orders/:id` - Xóa order

### Order Items Endpoints
- `GET /api/orders/:id/order-items` - Lấy items của order
- `POST /api/orders/:id/order-items` - Thêm item vào order
- `PUT /api/orders/:id/order-items/:itemId` - Cập nhật item
- `DELETE /api/orders/:id/order-items/:itemId` - Xóa item

## 🔍 Logging và Monitoring

### Payment Logs
Hệ thống sẽ log chi tiết:
- Tạo payment URL
- Thông tin giao dịch VNPAY
- Kết quả xử lý callback
- Thay đổi trạng thái payment

### Sample Logs
```
=== TẠO URL THANH TOÁN VNPAY ===
Order ID: 1
Amount: 100000
✅ Đã tạo bản ghi payment mới

=== XỬ LÝ CALLBACK VNPAY ===
🎉 THANH TOÁN THÀNH CÔNG!
✅ Đã cập nhật payment trong CSDL:
  - Status thay đổi: false → true
```

## 🛠️ Troubleshooting

### Lỗi Thường Gặp

1. **"Invalid signature"**
   - Kiểm tra Hash Secret
   - Kiểm tra TMN Code
   - Đảm bảo system clock đúng (năm 2024)

2. **"Transaction time expired"**
   - System clock sai (đang ở năm 2025)
   - Sửa system clock về năm 2024

3. **"Payment not found"**
   - Kiểm tra paymentId
   - Đảm bảo payment đã được tạo

4. **"Order not found"**
   - Kiểm tra orderId
   - Đảm bảo order đã được tạo

### Debug Tips
- Kiểm tra logs server
- Sử dụng Postman để test từng step
- Verify database records
- Check environment variables

## 🔐 Bảo Mật

### VNPAY Security
- Sử dụng HMAC-SHA512 cho signature
- Validate tất cả callback parameters
- Kiểm tra response code từ VNPAY
- Log tất cả giao dịch

### API Security
- Authentication required cho order operations
- Validate input data
- Sanitize user inputs
- Rate limiting (recommended)

## 📈 Monitoring và Analytics

### Metrics to Track
- Payment success rate
- Average processing time
- Error rates by type
- Transaction volumes

### Recommended Tools
- Database monitoring
- API performance monitoring
- Error tracking (Sentry, etc.)
- Log aggregation

## 🚀 Production Deployment

### Checklist
- [ ] Update VNPAY credentials to production
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure proper logging
- [ ] Set up monitoring
- [ ] Test complete flow in staging
- [ ] Update frontend URLs
- [ ] Configure backup strategies

### Environment Variables (Production)
```env
VNPAY_URL=https://pay.vnpay.vn/vpcpay.html
VNPAY_RETURN_URL=https://yourdomain.com/api/payment/vnpay_return
FRONTEND_URL=https://yourdomain.com
```

## 📞 Support

### VNPAY Support
- Sandbox: https://sandbox.vnpayment.vn/
- Documentation: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop
- Support: support@vnpay.vn

### Internal Support
- Check logs for detailed error information
- Use Postman collection for testing
- Verify database state
- Test with sandbox environment first

## 📝 Changelog

### v1.0.0
- Initial VNPAY integration
- Complete payment flow
- Comprehensive testing tools
- Detailed logging
- Postman collection
- Automated test scripts 