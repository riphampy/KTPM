const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');

exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medications, notes, fee } = req.body;
    const doctorId = req.user.id;

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId).populate('patientId').populate('doctorId');
    if (!appointment || appointment.doctorId._id.toString() !== doctorId) {
      return res.status(403).json({ message: 'Không tìm thấy lịch hẹn hoặc không có quyền' });
    }

    const prescription = new Prescription({
      appointmentId,
      patientId: appointment.patientId,
      doctorId,
      diagnosis,
      medications,
      notes
    });

    await prescription.save();

    // Mark appointment as completed
    appointment.status = 'Completed';
    if (fee !== undefined) {
      appointment.fee = Number(fee);
    }
    await appointment.save();

    // Tạo file PDF
    try {
      const pdfBuffer = await pdfService.generatePrescriptionPDF({
        doctorName: appointment.doctorId.name,
        patientName: appointment.patientId.name,
        date: new Date(),
        diagnosis,
        medications
      });

      // Gửi email đính kèm file
      const emailHtml = `
        <h3>Thông báo đơn thuốc điện tử</h3>
        <p>Xin chào ${appointment.patientId.name},</p>
        <p>Bác sĩ ${appointment.doctorId.name} đã hoàn tất việc kê đơn thuốc cho buổi khám của bạn.</p>
        <p>Vui lòng xem chi tiết đơn thuốc được đính kèm ở file PDF trong email này.</p>
        <p>Cảm ơn bạn đã tin tưởng Smart Hospital.</p>
      `;

      await emailService.sendEmail(
        appointment.patientId.email,
        'Đơn thuốc điện tử - Smart Hospital',
        emailHtml,
        [{ filename: 'DonThuoc.pdf', content: pdfBuffer }]
      );
    } catch (pdfErr) {
      console.error('Lỗi khi tạo PDF hoặc gửi mail:', pdfErr);
    }

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await Prescription.find({ patientId }).populate('doctorId', 'name');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
