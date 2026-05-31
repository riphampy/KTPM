const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  shift: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);
