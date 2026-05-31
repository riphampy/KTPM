const DoctorSchedule = require('../models/DoctorSchedule');
const Appointment = require('../models/Appointment');
const emailService = require('../services/emailService');

exports.createSchedule = async (req, res) => {
  try {
    const { date, shift } = req.body;
    const doctorId = req.user.id; 

    // Validate if the date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    if (selectedDate < today) {
      return res.status(400).json({ message: 'Không thể tạo ca khám trong quá khứ' });
    }

    const schedule = new DoctorSchedule({
      doctorId,
      date,
      shift
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getDoctorSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const schedules = await DoctorSchedule.find({ doctorId, isAvailable: true, date: { $gte: new Date() } });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await DoctorSchedule.find().populate('doctorId', 'name email').sort({ date: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await DoctorSchedule.findById(id);
    if (!schedule) return res.status(404).json({ message: 'Không tìm thấy ca khám' });

    // Assuming we shouldn't delete if it's already booked, but admin can force delete.
    if (!schedule.isAvailable && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Ca khám đã được đặt, không thể xóa' });
    }

    if (!schedule.isAvailable) {
      const appointments = await Appointment.find({ scheduleId: id, status: { $in: ['Pending', 'Confirmed'] } }).populate('patientId', 'name email');
      
      for (const appt of appointments) {
        appt.status = 'Cancelled';
        await appt.save();

        if (appt.patientId && appt.patientId.email) {
          const emailHtml = `
            <h3>Thông báo hủy lịch khám</h3>
            <p>Xin chào ${appt.patientId.name},</p>
            <p>Lịch khám của bạn vào ngày <strong>${new Date(appt.date).toLocaleDateString('vi-VN')}</strong> (Ca: ${appt.shift}) đã bị hủy do lịch làm việc của Bác sĩ có sự thay đổi.</p>
            <p>Vui lòng truy cập hệ thống để đặt lại lịch khám mới. Xin chân thành xin lỗi vì sự bất tiện này!</p>
            <p>Trân trọng!</p>
          `;
          try {
            await emailService.sendEmail(appt.patientId.email, 'Thông báo hủy lịch khám - Smart Hospital', emailHtml);
          } catch (mailErr) {
            console.error('[Email] Error sending cancellation email:', mailErr);
          }
        }
      }
    }

    await DoctorSchedule.findByIdAndDelete(id);
    res.json({ message: 'Xóa ca khám thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
