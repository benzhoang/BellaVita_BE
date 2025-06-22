const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');
const Payment = require('../models/paymentModel'); // Import Payment model
const Order = require('../models/orderModel'); // Import Order model

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const PaymentController = {
  // Lấy payment theo ID
  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment not found' });
      }
      res.json({ success: true, payment });
    } catch (error) {
      console.error("❌ Lỗi lấy payment:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Lấy tất cả payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.json({ success: true, payments });
    } catch (error) {
      console.error("❌ Lỗi lấy tất cả payments:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createPaymentUrl: async (req, res) => {
    try {
      const ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const { orderId, amount, bankCode, orderDescription, orderType, language } = req.body;

      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Order ID is required' });
      }

      console.log('=== TẠO URL THANH TOÁN VNPAY ===');
      console.log('Order ID:', orderId);
      console.log('Amount:', amount);
      console.log('Bank Code:', bankCode);
      console.log('IP Address:', ipAddr);

      // 1. Tạo một bản ghi thanh toán mới trong CSDL với trạng thái chờ
      const newPayment = await Payment.create({
        order_id: orderId,
        method: 'VNPAY',
        status: false, // Trạng thái ban đầu: chưa thanh toán
        transaction_id: null, // Sẽ cập nhật sau
        processed_at: null,
      });

      console.log('✅ Đã tạo bản ghi payment mới:');
      console.log('  - Payment ID:', newPayment.payment_id);
      console.log('  - Order ID:', newPayment.order_id);
      console.log('  - Status:', newPayment.status);
      console.log('  - Method:', newPayment.method);

      const paymentId = newPayment.payment_id; // Dùng ID của payment làm mã giao dịch

      const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      const vnpReturnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/payment/vnpay_return';
      const vnpTmnCode = process.env.VNPAY_TMN_CODE;
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET;
      
      const createDate = moment(new Date()).format('YYYYMMDDHHmmss');
      
      let vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = vnpTmnCode;
      vnp_Params['vnp_Amount'] = Math.round(amount * 100);
      vnp_Params['vnp_CurrCode'] = 'VND';
      if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
      }
      vnp_Params['vnp_TxnRef'] = paymentId; // Sử dụng payment_id làm mã giao dịch
      vnp_Params['vnp_OrderInfo'] = orderDescription || `Thanh toan cho don hang ${orderId}`;
      vnp_Params['vnp_OrderType'] = orderType || 'billpayment';
      vnp_Params['vnp_Locale'] = language || 'vn';
      vnp_Params['vnp_ReturnUrl'] = vnpReturnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      
      vnp_Params = sortObject(vnp_Params);
      
      const signData = querystring.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac('sha512', vnpHashSecret);
      const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      const finalUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
      
      // Cập nhật transaction_id cho bản ghi payment
      await newPayment.update({ transaction_id: paymentId.toString() });

      console.log('✅ Đã tạo URL thanh toán VNPAY:');
      console.log('  - Transaction ID:', paymentId);
      console.log('  - Create Date:', createDate);
      console.log('  - Return URL:', vnpReturnUrl);
      console.log('=== HOÀN THÀNH TẠO URL THANH TOÁN ===\n');

      res.json({
        success: true,
        paymentUrl: finalUrl
      });
      
    } catch (error) {
      console.error("❌ Lỗi tạo payment URL:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  vnpayReturn: async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const returnMethod = process.env.VNPAY_RETURN_METHOD || 'REDIRECT'; // Mặc định là REDIRECT

    try {
      console.log('=== XỬ LÝ CALLBACK VNPAY ===');
      console.log('Query params:', req.query);
      
      let vnp_Params = req.query;
      const secureHash = vnp_Params['vnp_SecureHash'];
      
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];
      
      const paymentId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];
      const amount = vnp_Params['vnp_Amount'];
      const bankCode = vnp_Params['vnp_BankCode'];
      const transactionNo = vnp_Params['vnp_TransactionNo'];
      const payDate = vnp_Params['vnp_PayDate'];

      console.log('📋 Thông tin giao dịch:');
      console.log('  - Payment ID:', paymentId);
      console.log('  - Response Code:', responseCode);
      console.log('  - Amount:', amount);
      console.log('  - Bank Code:', bankCode);
      console.log('  - Transaction No:', transactionNo);
      console.log('  - Pay Date:', payDate);

      const payment = await Payment.findByPk(paymentId);

      if (!payment) {
        console.log('❌ Không tìm thấy payment với ID:', paymentId);
        return res.redirect(`${frontendUrl}/payment-result?success=false&message=Payment not found`);
      }

      console.log('✅ Tìm thấy payment:');
      console.log('  - Order ID:', payment.order_id);
      console.log('  - Current Status:', payment.status);
      console.log('  - Method:', payment.method);

      // Nếu thanh toán đã được xử lý, không làm gì thêm
      if (payment.status === true) {
        console.log('⚠️ Payment đã được xử lý trước đó, không cần xử lý lại');
        return res.redirect(`${frontendUrl}/payment-result?success=true&message=Payment already confirmed&orderId=${payment.order_id}`);
      }

      vnp_Params = sortObject(vnp_Params);
      
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET;
      const signData = querystring.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac('sha512', vnpHashSecret);
      const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      
      console.log('🔐 Kiểm tra chữ ký:');
      console.log('  - Dữ liệu để hash (trên BE):', signData);
      console.log('  - Received Hash:', secureHash);
      console.log('  - Calculated Hash:', signed);
      console.log('  - Hash Match:', secureHash === signed);
      
      if (secureHash === signed) {
        if (responseCode === '00') {
          console.log('🎉 THANH TOÁN THÀNH CÔNG!');
          
          // Lưu trạng thái cũ để so sánh
          const oldStatus = payment.status;
          const oldProcessedAt = payment.processed_at;
          
          // Thanh toán thành công, cập nhật CSDL
          await payment.update({
            status: true,
            processed_at: new Date()
          });

          console.log('✅ Đã cập nhật payment trong CSDL:');
          console.log('  - Status thay đổi:', oldStatus, '→', true);
          console.log('  - Processed At thay đổi:', oldProcessedAt, '→', new Date());
          console.log('  - Order ID:', payment.order_id);
          console.log('  - Transaction ID:', payment.transaction_id);
          
          // Cập nhật trạng thái của Order liên quan
          const order = await Order.findByPk(payment.order_id);
          if (order) {
            const oldOrderStatus = order.status;
            await order.update({ status: true }); // true có thể hiểu là "đã thanh toán"
            console.log('✅ Đã cập nhật order trong CSDL:');
            console.log('  - Order ID:', order.order_id);
            console.log('  - Order Status thay đổi:', oldOrderStatus, '→', true);
          } else {
            console.log('⚠️ Không tìm thấy order với ID:', payment.order_id, 'để cập nhật trạng thái.');
          }
          
          console.log('=== HOÀN THÀNH XỬ LÝ THANH TOÁN THÀNH CÔNG ===\n');
          
          if (returnMethod === 'JSON') {
            return res.json({ success: true, message: 'Payment successful', orderId: payment.order_id, data: vnp_Params });
          }
          res.redirect(`${frontendUrl}/payment-result?success=true&message=Payment successful&orderId=${payment.order_id}`);
        } else {
          console.log('❌ THANH TOÁN THẤT BẠI');
          console.log('  - Response Code:', responseCode);
          console.log('  - Lý do: Mã phản hồi không phải 00');
          
          // Lưu trạng thái cũ để so sánh
          const oldStatus = payment.status;
          
          // Thanh toán thất bại
          await payment.update({ status: false }); // Vẫn là false
          
          console.log('✅ Đã cập nhật payment trong CSDL:');
          console.log('  - Status giữ nguyên:', oldStatus, '→', false);
          console.log('  - Order ID:', payment.order_id);
          
          console.log('=== HOÀN THÀNH XỬ LÝ THANH TOÁN THẤT BẠI ===\n');
          
          if (returnMethod === 'JSON') {
            return res.status(400).json({ success: false, message: 'Payment failed', code: responseCode, orderId: payment.order_id, data: vnp_Params });
          }
          res.redirect(`${frontendUrl}/payment-result?success=false&message=Payment failed&code=${responseCode}&orderId=${payment.order_id}`);
        }
      } else {
        console.log('❌ CHỮ KÝ KHÔNG HỢP LỆ');
        console.log('  - Lý do: Hash không khớp');
        console.log('=== HOÀN THÀNH XỬ LÝ - CHỮ KÝ KHÔNG HỢP LỆ ===\n');
        
        if (returnMethod === 'JSON') {
          return res.status(400).json({ success: false, message: 'Invalid signature', orderId: payment.order_id });
        }
        res.redirect(`${frontendUrl}/payment-result?success=false&message=Invalid signature&orderId=${payment.order_id}`);
      }
    } catch (error) {
      console.error("❌ Lỗi trong vnpayReturn:", error);
      console.log('=== HOÀN THÀNH XỬ LÝ - CÓ LỖI ===\n');
      
      if (returnMethod === 'JSON') {
        return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
      }
      res.redirect(`${frontendUrl}/payment-result?success=false&message=An error occurred`);
    }
  }
};

module.exports = PaymentController; 