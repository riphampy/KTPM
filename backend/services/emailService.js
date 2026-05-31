const nodemailer = require('nodemailer');

// Cấu hình Email
let transporter;

const initTransporter = async () => {
  if (!transporter) {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Dùng Gmail thật nếu có config trong .env
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('✅ Hệ thống Email đã kết nối bằng Gmail thật.');
    } else {
      // Dùng Ethereal Email để test
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('⚠️ Hệ thống đang dùng Ethereal (Test mô phỏng).');
    }
  }
  return transporter;
};

exports.sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const mailTransporter = await initTransporter();
    
    const info = await mailTransporter.sendMail({
      from: '"Smart Hospital" <no-reply@smarthospital.local>',
      to,
      subject,
      html: htmlContent,
      attachments
    });

    console.log(`[Email] Đã gửi email tới: ${to}`);
    if (!process.env.EMAIL_USER) {
      console.log(`[Email] URL để xem email: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};
