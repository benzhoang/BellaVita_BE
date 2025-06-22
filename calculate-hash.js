const crypto = require('crypto');
const querystring = require('qs');

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

// Thông tin test - thay đổi theo dữ liệu thực tế của bạn
const testParams = {
  vnp_Amount: '15000000', // 150,000 VND (VNPAY tính bằng xu) - 2x50,000 + 1x50,000
  vnp_BankCode: 'VNPAYQR',
  vnp_BankTranNo: 'VNPAY123456',
  vnp_CardType: 'QR',
  vnp_OrderInfo: 'Thanh toan don hang 1', // Thay đổi orderId theo thực tế
  vnp_PayDate: '20251221143000',
  vnp_ResponseCode: '00',
  vnp_TmnCode: 'YOUR_TMN_CODE', // Thay đổi thành TMN Code thực tế
  vnp_TransactionNo: '12345678',
  vnp_TransactionStatus: '00',
  vnp_TxnRef: '1' // Thay đổi thành payment ID thực tế
};

// Hash Secret từ environment
const vnpHashSecret = 'YOUR_HASH_SECRET'; // Thay đổi thành Hash Secret thực tế

// Sắp xếp parameters
const sortedParams = sortObject(testParams);

// Tạo chuỗi để ký
const signData = querystring.stringify(sortedParams, { encode: false });

// Tạo chữ ký
const hmac = crypto.createHmac('sha512', vnpHashSecret);
const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

console.log('=== TÍNH TOÁN SECURE HASH CHO TEST ===');
console.log('Parameters:', JSON.stringify(testParams, null, 2));
console.log('Sorted Parameters:', JSON.stringify(sortedParams, null, 2));
console.log('Sign Data:', signData);
console.log('Hash Secret:', vnpHashSecret);
console.log('Secure Hash:', signed);
console.log('\n=== URL TEST HOÀN CHỈNH ===');
console.log(`http://localhost:3000/api/payment/vnpay_return?vnp_Amount=${testParams.vnp_Amount}&vnp_BankCode=${testParams.vnp_BankCode}&vnp_BankTranNo=${testParams.vnp_BankTranNo}&vnp_CardType=${testParams.vnp_CardType}&vnp_OrderInfo=${encodeURIComponent(testParams.vnp_OrderInfo)}&vnp_PayDate=${testParams.vnp_PayDate}&vnp_ResponseCode=${testParams.vnp_ResponseCode}&vnp_TmnCode=${testParams.vnp_TmnCode}&vnp_TransactionNo=${testParams.vnp_TransactionNo}&vnp_TransactionStatus=${testParams.vnp_TransactionStatus}&vnp_TxnRef=${testParams.vnp_TxnRef}&vnp_SecureHash=${signed}`);

console.log('\n=== HƯỚNG DẪN SỬ DỤNG ===');
console.log('1. Thay đổi YOUR_TMN_CODE thành TMN Code thực tế');
console.log('2. Thay đổi YOUR_HASH_SECRET thành Hash Secret thực tế');
console.log('3. Thay đổi orderId và paymentId theo dữ liệu thực tế');
console.log('4. Chạy lại script để lấy hash mới');
console.log('5. Sử dụng URL hoàn chỉnh để test callback');
console.log('\n=== LƯU Ý ===');
console.log('- vnp_Amount = 15000000 (150,000 VND x 100)');
console.log('- Tổng tiền này tương ứng với: 2x sản phẩm 50,000 + 1x sản phẩm 50,000');
console.log('- Đảm bảo amount này khớp với total_amount của order'); 