const PDFDocument = require('pdfkit');

exports.generatePrescriptionPDF = (prescriptionData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('Smart Hospital', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('DON THUOC (PRESCRIPTION)', { align: 'center', underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Bac si: ${prescriptionData.doctorName}`);
      doc.text(`Benh nhan: ${prescriptionData.patientName}`);
      doc.text(`Ngay: ${new Date(prescriptionData.date).toLocaleDateString('vi-VN')}`);
      doc.moveDown();

      doc.fontSize(14).text('Chan doan:', { underline: true });
      doc.fontSize(12).text(prescriptionData.diagnosis);
      doc.moveDown();

      doc.fontSize(14).text('Danh sach thuoc:', { underline: true });
      doc.moveDown(0.5);

      prescriptionData.medications.forEach((med, index) => {
        doc.fontSize(12).text(`${index + 1}. ${med.name}`);
        doc.fontSize(10).text(`   - Lieu dung: ${med.dosage}`);
        doc.text(`   - Cach dung: ${med.instructions}`);
        doc.moveDown(0.5);
      });

      doc.moveDown(2);
      doc.fontSize(12).text('Bac si ky ten', { align: 'right' });
      doc.text(`(Da ky dien tu)`, { align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
