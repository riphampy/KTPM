const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const emailService = require('../services/emailService');

const initCronJobs = () => {
  // 1. Nhắc nhở lịch khám (chạy mỗi 7h sáng hằng ngày)
  cron.schedule('0 7 * * *', async () => {
    try {
      console.log('[CRON] Đang chạy cron nhắc lịch khám...');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);

      const upcomingAppointments = await Appointment.find({
        status: 'Confirmed',
        date: { $gte: tomorrow, $lt: nextDay }
      }).populate('patientId', 'name email').populate('doctorId', 'name');

      for (const app of upcomingAppointments) {
        if (app.patientId && app.patientId.email) {
          const htmlContent = `
            <h3>Nhắc nhở lịch khám</h3>
            <p>Xin chào ${app.patientId.name},</p>
            <p>Bạn có lịch hẹn khám với Bác sĩ ${app.doctorId.name} vào ngày mai (${new Date(app.date).toLocaleDateString()}), ca ${app.shift}.</p>
            <p>Vui lòng đến đúng giờ. Xin cảm ơn!</p>
          `;
          await emailService.sendEmail(app.patientId.email, 'Nhắc nhở lịch khám - Smart Hospital', htmlContent);
        }
      }
    } catch (error) {
      console.error('[CRON] Lỗi khi nhắc lịch khám:', error);
    }
  });

  // 2. Nhắc nhở uống thuốc (chạy mỗi 8h sáng hằng ngày)
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('[CRON] Đang chạy cron nhắc uống thuốc...');
      const today = new Date();

      // Lấy các đơn thuốc được kê trong vòng 7 ngày gần đây (ví dụ)
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 7);

      const activePrescriptions = await Prescription.find({
        createdAt: { $gte: recentDate }
      }).populate('patientId', 'name email');

      for (const rx of activePrescriptions) {
        if (rx.patientId && rx.patientId.email && rx.medications && rx.medications.length > 0) {
          const medsList = rx.medications.map(m => `<li>${m.name} - ${m.dosage}</li>`).join('');
          const htmlContent = `
            <h3>Nhắc nhở uống thuốc</h3>
            <p>Xin chào ${rx.patientId.name},</p>
            <p>Hệ thống nhắc bạn sử dụng thuốc đúng liều lượng theo chỉ định sau:</p>
            <ul>${medsList}</ul>
            <p>Chúc bạn mau khỏe!</p>
          `;
          await emailService.sendEmail(rx.patientId.email, 'Nhắc nhở uống thuốc - Smart Hospital', htmlContent);
        }
      }
    } catch (error) {
      console.error('[CRON] Lỗi khi nhắc uống thuốc:', error);
    }
  });
};

module.exports = initCronJobs;
