const Prescription = require('../models/Prescription');
const User = require('../models/User');

exports.getPatientSharedRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Lấy tất cả đơn thuốc của bệnh nhân, populate thông tin bác sĩ và khoa của bác sĩ
    const records = await Prescription.find({ patientId })
      .populate('appointmentId')
      .populate({
        path: 'doctorId',
        select: 'name email departmentId',
        populate: {
          path: 'departmentId',
          model: 'Department',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy hồ sơ sức khỏe', error: error.message });
  }
};
