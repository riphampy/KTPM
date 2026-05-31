require('dotenv').config();
const emailService = require('./services/emailService');

async function runTest() {
  console.log('Đang kết nối hệ thống gửi Mail...');
  const success = await emailService.sendEmail(
    'duyduy1294@gmail.com',
    'Thử nghiệm hệ thống Gửi Mail - Smart Hospital',
    '<h3>Xin chào!</h3><p>Nếu bạn đọc được dòng này, chức năng gửi Email của hệ thống hoạt động hoàn hảo!</p>'
  );
  
  if (success) {
    console.log('\n✅ TEST THÀNH CÔNG!');
    console.log('Lưu ý: Hệ thống đang dùng Ethereal Email (Môi trường test mô phỏng).');
    console.log('Bạn hãy CLICK VÀO ĐƯỜNG LINK VỪA HIỆN TRÊN CONSOLE để xem trước giao diện Email nhé!');
  } else {
    console.log('\n❌ Lỗi khi gửi mail!');
  }
}

runTest();
