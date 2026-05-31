const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  medications: [{
    name: String,
    dosage: String,
    duration: String,
    instructions: String
  }],
  notes: { type: String },
  prescriptionFileUrl: { type: String } // Link to the generated PDF/Image
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
