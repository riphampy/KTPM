const DoctorSchedule = require('../models/DoctorSchedule');

exports.createSchedule = async (req, res) => {
  try {
    const { date, shift } = req.body;
    // Assuming auth middleware sets req.user
    const doctorId = req.user.id; 

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

    await DoctorSchedule.findByIdAndDelete(id);
    res.json({ message: 'Xóa ca khám thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
