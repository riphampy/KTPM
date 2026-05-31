const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Token hết hạn sau 1 giờ (3600 giây)
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
