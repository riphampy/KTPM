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
