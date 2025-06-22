# Hướng Dẫn Test Toàn Bộ Quy Trình Thanh Toán VNPAY

## 📋 Tổng Quan
Hướng dẫn này sẽ giúp bạn test toàn bộ quy trình từ tạo order đến thanh toán thành công bằng VNPAY.

## 🚀 Các Bước Thực Hiện

### Bước 1: Chuẩn Bị
1. **Import Postman Collection**
   - Mở Postman
   - Import file `Complete_Payment_Flow_Postman.json`
   - Cập nhật các biến môi trường

2. **Cập nhật Environment Variables**
   ```
   baseUrl: http://localhost:3000
   accessToken: (sẽ được cập nhật sau khi login)
   orderId: (sẽ được cập nhật sau khi tạo order)
   paymentId: (sẽ được cập nhật sau khi tạo payment)
   vnpayTmnCode: YOUR_ACTUAL_TMN_CODE
   secureHash: (sẽ được tính toán)
   ```

### Bước 2: Authentication
1. **Login User**
   - Chạy request "Login User"
   - Cập nhật email/password theo user thực tế
   - Copy `accessToken` từ response và cập nhật biến `accessToken`

### Bước 3: Tạo Order với Items
1. **Create Order with Items**
   - Chạy request "Create Order with Items"
   - Copy `order_id` từ response và cập nhật biến `orderId`
   - Response sẽ bao gồm cả order items và tổng tiền đã tính toán
   - Response mẫu:
   ```json
   {
     "order_id": 1,
     "user_id": 1,
     "status": false,
     "payment_method": "VNPAY",
     "total_amount": "150000.00",
     "orderItems": [
       {
         "order_item_id": 1,
         "order_id": 1,
         "product_id": 1,
         "quantity": 2,
         "price": "50000.00"
       },
       {
         "order_item_id": 2,
         "order_id": 1,
         "product_id": 2,
         "quantity": 1,
         "price": "50000.00"
       }
     ]
   }
   ```

### Bước 4: Kiểm Tra Order
1. **Get Order Details**
   - Chạy request "Get Order Details"
   - Kiểm tra order và order items đã được tạo đúng
   - Verify tổng tiền đã được tính toán chính xác

### Bước 5: Tạo Payment URL
1. **Create VNPAY Payment URL**
   - Chạy request "Create VNPAY Payment URL"
   - Copy `paymentUrl` từ response
   - Copy `payment_id` từ response và cập nhật biến `paymentId`
   - **Lưu ý**: Amount sẽ là 150,000 VND (tổng tiền của order)
   - Response mẫu:
   ```json
   {
     "success": true,
     "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
   }
   ```

### Bước 6: Test Payment (Tùy Chọn)
1. **Mở URL thanh toán trong browser**
   - Copy `paymentUrl` và mở trong browser
   - Test thanh toán trên VNPAY sandbox
   - Hoặc sử dụng bước 7 để simulate

### Bước 7: Simulate VNPAY Callback
1. **Tính toán Secure Hash**
   ```bash
   node calculate-hash.js
   ```
   - Cập nhật `YOUR_TMN_CODE` và `YOUR_HASH_SECRET` trong file
   - Cập nhật `orderId` và `paymentId` theo thực tế
   - **Lưu ý**: vnp_Amount = 15000000 (150,000 VND x 100)
   - Chạy script để lấy hash

2. **Test Callback Success**
   - Sử dụng URL được tạo từ script hoặc
   - Chạy request "Simulate VNPAY Success Return"
   - Cập nhật `secureHash` trong Postman variables

### Bước 8: Kiểm Tra Kết Quả
1. **Check Payment Status**
   - Chạy request "Check Payment Status"
   - Kiểm tra `status` đã chuyển thành `true`
   - Kiểm tra `processed_at` đã được cập nhật

## 🔍 Kiểm Tra Logs

Trong console của server, bạn sẽ thấy logs chi tiết:

```
=== TẠO ĐƠN HÀNG MỚI ===
📋 Dữ liệu order: {
  "user_id": 1,
  "status": false,
  "payment_method": "VNPAY",
  "total_amount": 0
}
✅ Đã tạo order với ID: 1

📦 Bắt đầu tạo order items...
  - Sản phẩm 1: 2x 50000 = 100000
  - Sản phẩm 2: 1x 50000 = 50000
✅ Đã tạo 2 order items
💰 Tổng tiền tính toán: 150000
✅ Đã cập nhật total_amount: 150000

🎉 HOÀN THÀNH TẠO ĐƠN HÀNG!
📊 Tóm tắt:
  - Order ID: 1
  - User ID: 1
  - Total Amount: 150000
  - Order Items: 2

=== TẠO URL THANH TOÁN VNPAY ===
Order ID: 1
Amount: 150000
✅ Đã tạo bản ghi payment mới

=== XỬ LÝ CALLBACK VNPAY ===
📋 Thông tin giao dịch:
  - Payment ID: 1
  - Response Code: 00
  - Amount: 15000000
  - Bank Code: VNPAYQR

🎉 THANH TOÁN THÀNH CÔNG!
✅ Đã cập nhật payment trong CSDL:
  - Status thay đổi: false → true
  - Processed At thay đổi: null → 2024-12-21T14:30:00.000Z
```

## 🛠️ Troubleshooting

### Lỗi thường gặp:

1. **"Invalid signature"**
   - Kiểm tra Hash Secret có đúng không
   - Kiểm tra TMN Code có đúng không
   - Đảm bảo system clock đúng (năm 2024)

2. **"Payment not found"**
   - Kiểm tra paymentId có đúng không
   - Đảm bảo payment đã được tạo trước khi test callback

3. **"Order not found"**
   - Kiểm tra orderId có đúng không
   - Đảm bảo order đã được tạo

4. **"Product not found"**
   - Kiểm tra product_id trong orderItems có tồn tại không
   - Đảm bảo database có dữ liệu sản phẩm

5. **"Transaction time expired"**
   - System clock sai (đang ở năm 2025)
   - Cần sửa system clock về năm 2024

## 📝 Lưu Ý Quan Trọng

1. **System Clock**: Đảm bảo máy tính đang ở năm 2024, không phải 2025
2. **Environment Variables**: Cập nhật đầy đủ các biến môi trường
3. **Database**: Đảm bảo database đã được migrate và có dữ liệu sản phẩm
4. **VNPAY Credentials**: Sử dụng credentials sandbox thực tế
5. **Amount Calculation**: Tổng tiền sẽ được tính tự động từ order items

## 🎯 Kết Quả Mong Đợi

Sau khi hoàn thành tất cả các bước:
- Order được tạo với status = false
- Order items được tạo cùng với order
- Total amount được tính tự động (150,000 VND)
- Payment được tạo với status = false
- VNPAY URL được tạo thành công
- Callback xử lý thành công
- Payment status chuyển thành true
- Order có thể được cập nhật status (tùy logic business)

## 🔗 Files Liên Quan

- `Complete_Payment_Flow_Postman.json`: Postman collection
- `calculate-hash.js`: Script tính toán hash
- `paymentController.js`: Controller xử lý thanh toán
- `orderController.js`: Controller xử lý đơn hàng (đã cập nhật)
- `test-complete-flow.js`: Script test tự động (đã cập nhật)

## 💡 Tính Năng Mới

### Tạo Order với Items
- Tạo order và order items trong một request
- Tự động tính tổng tiền từ order items
- Validate sản phẩm tồn tại
- Log chi tiết quá trình tạo

### Request Format
```json
{
  "user_id": 1,
  "status": false,
  "payment_method": "VNPAY",
  "orderItems": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 50000
    },
    {
      "product_id": 2,
      "quantity": 1,
      "price": 50000
    }
  ]
}
``` 