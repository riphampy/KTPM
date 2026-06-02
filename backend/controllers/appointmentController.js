const Appointment = require('../models/Appointment');
const DoctorSchedule = require('../models/DoctorSchedule');
const emailService = require('../services/emailService');
const User = require('../models/User');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, scheduleId, date, shift, symptoms } = req.body;
    const patientId = req.user.id;

    // Atomically check and update schedule availability
    const schedule = await DoctorSchedule.findOneAndUpdate(
      { _id: scheduleId, doctorId: doctorId, isAvailable: true },
      { $set: { isAvailable: false } },
      { new: true }
    );

    if (!schedule) {
      return res.status(400).json({ message: 'Ca khám này đã được đặt hoặc không tồn tại' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      scheduleId,
      date,
      shift,
      symptoms
    });

    await appointment.save();

    // Gửi email thông báo
    const patient = await User.findById(patientId);
    if (patient) {
      const emailHtml = `
        <h3>Đặt lịch khám thành công</h3>
        <p>Xin chào ${patient.name},</p>
        <p>Yêu cầu đặt lịch khám của bạn vào ngày <strong>${new Date(date).toLocaleDateString('vi-VN')}</strong> (Ca: ${shift}) đã được ghi nhận và đang chờ bác sĩ xác nhận.</p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của Smart Hospital!</p>
      `;
      emailService.sendEmail(patient.email, 'Xác nhận đặt lịch khám - Smart Hospital', emailHtml);
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let query = {};
    if (role === 'patient') query.patientId = userId;
    else if (role === 'doctor') query.doctorId = userId;

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Security check: Patient can only cancel their own appointments
    if (req.user.role === 'patient' && status !== 'Cancelled') {
      return res.status(403).json({ message: 'Bệnh nhân chỉ được phép hủy lịch khám' });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true }).populate('patientId', 'name email');

    // Nếu hủy lịch, giải phóng lại ca khám
    if (status === 'Cancelled') {
      const schedule = await DoctorSchedule.findById(appointment.scheduleId);
      if (schedule) {
        schedule.isAvailable = true;
        await schedule.save();
      }
    }

    if (appointment.patientId && appointment.patientId.email) {
      let statusText = '';
      if (status === 'Confirmed') statusText = 'đã được Bác sĩ <strong>CHẤP NHẬN</strong>';
      else if (status === 'Cancelled') statusText = 'đã bị <strong>HỦY</strong>';
      else if (status === 'Completed') statusText = 'đã <strong>HOÀN THÀNH</strong>';

      if (statusText !== '') {
        const emailHtml = `
          <h3>Cập nhật trạng thái lịch khám</h3>
          <p>Xin chào ${appointment.patientId.name},</p>
          <p>Lịch khám của bạn vào ngày <strong>${new Date(appointment.date).toLocaleDateString('vi-VN')}</strong> (Ca: ${appointment.shift}) ${statusText}.</p>
          <p>Trân trọng!</p>
        `;
        try {
          await emailService.sendEmail(appointment.patientId.email, 'Cập nhật trạng thái lịch khám - Smart Hospital', emailHtml);
          console.log('[Email] Status update email sent successfully.');
        } catch (mailErr) {
          console.error('[Email] Error sending status update email:', mailErr);
        }
      }
    } else {
      console.log('[Email] Warning: patientId or email is missing, cannot send status email.');
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email')
      .populate('scheduleId')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    if (!['Unpaid', 'Paid', 'Refunded'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ' });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { paymentStatus }, { new: true }).populate('patientId', 'name email');
    if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
