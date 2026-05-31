const nodemailer = require('nodemailer');

// Cấu hình Ethereal Email để test (sẽ tự động in ra URL xem email trong console)
let transporter;

const initTransporter = async () => {
  if (!transporter) {
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
    console.log(`[Email] URL để xem email: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};
