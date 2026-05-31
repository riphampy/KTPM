const PDFDocument = require('pdfkit');

exports.generatePrescriptionPDF = (prescriptionData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      const path = require('path');
      const fontPath = path.join(__dirname, '../fonts/Roboto-Regular.ttf');
      doc.font(fontPath);

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('Smart Hospital', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('ĐƠN THUỐC (PRESCRIPTION)', { align: 'center', underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Bác sĩ: ${prescriptionData.doctorName}`);
      doc.text(`Bệnh nhân: ${prescriptionData.patientName}`);
      doc.text(`Ngày: ${new Date(prescriptionData.date).toLocaleDateString('vi-VN')}`);
      doc.moveDown();

      doc.fontSize(14).text('Chẩn đoán:', { underline: true });
      doc.fontSize(12).text(prescriptionData.diagnosis);
      doc.moveDown();

      doc.fontSize(14).text('Danh sách thuốc:', { underline: true });
      doc.moveDown(0.5);

      prescriptionData.medications.forEach((med, index) => {
        doc.fontSize(12).text(`${index + 1}. ${med.name}`);
        doc.fontSize(10).text(`   - Liều dùng: ${med.dosage}`);
        doc.text(`   - Cách dùng: ${med.instructions}`);
        doc.moveDown(0.5);
      });

      doc.moveDown(2);
      doc.fontSize(12).text('Bác sĩ ký tên', { align: 'right' });
      doc.text(`(Đã ký điện tử)`, { align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
