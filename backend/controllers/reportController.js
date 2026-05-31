const Appointment = require('../models/Appointment');
const User = require('../models/User');
const exceljs = require('exceljs');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

    // Top 3 bác sĩ có lịch hoàn thành nhiều nhất (doanh thu)
    const topDoctors = await Appointment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$doctorId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'doctorInfo' } },
      { $unwind: '$doctorInfo' },
      { $project: { name: '$doctorInfo.name', email: '$doctorInfo.email', appointmentsCompleted: '$count' } }
    ]);

    // Top 4 bệnh nhân VIP (tần suất khám nhiều nhất)
    const topPatients = await Appointment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$patientId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'patientInfo' } },
      { $unwind: '$patientInfo' },
      { $project: { name: '$patientInfo.name', email: '$patientInfo.email', visitCount: '$count' } }
    ]);

    // Tổng doanh thu
    const revenueResult = await Appointment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$fee' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalPatients,
      totalDoctors,
      completedAppointments,
      totalRevenue,
      topDoctors,
      topPatients
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'Completed' })
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .sort({ date: -1 });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Thong Ke Banh Vien');

    worksheet.columns = [
      { header: 'Ngay Kham', key: 'date', width: 20 },
      { header: 'Ca Kham', key: 'shift', width: 15 },
      { header: 'Benh Nhan', key: 'patient', width: 30 },
      { header: 'Bac Si', key: 'doctor', width: 30 },
      { header: 'Trang Thai', key: 'status', width: 15 }
    ];

    appointments.forEach(app => {
      worksheet.addRow({
        date: new Date(app.date).toLocaleDateString('vi-VN'),
        shift: app.shift,
        patient: app.patientId ? app.patientId.name : 'N/A',
        doctor: app.doctorId ? app.doctorId.name : 'N/A',
        status: app.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=DoanhThu_SmartHospital.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xuất Excel', error: error.message });
  }
};
