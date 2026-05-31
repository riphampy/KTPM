const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, dateOfBirth, gender, address, bloodType, departmentId } = req.body;
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Check if phone exists (if provided)
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phone,
      dateOfBirth,
      gender,
      address,
      bloodType,
      departmentId
    });

    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Create JWT token
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này.' });

    // Tạo token 64 ký tự ngẫu nhiên
    const token = crypto.randomBytes(32).toString('hex');

    // Lưu token vào DB
    await ResetToken.deleteMany({ userId: user._id }); // Xóa token cũ
    await new ResetToken({ userId: user._id, token }).save();

    // Gửi email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}&id=${user._id}`;
    const htmlContent = `
      <h3>Yêu cầu đặt lại mật khẩu</h3>
      <p>Xin chào ${user.name},</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng bấm vào đường dẫn dưới đây để tiếp tục:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #00838F; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
      <p>Liên kết này sẽ hết hạn trong 1 giờ.</p>
    `;

    try {
      await emailService.sendEmail(user.email, 'Khôi phục mật khẩu - Smart Hospital', htmlContent);
      console.log('[Email] Forgot password email sent successfully.');
      res.json({ message: 'Link khôi phục mật khẩu đã được gửi qua email của bạn.' });
    } catch (mailErr) {
      console.error('[Email] Error sending forgot password email:', mailErr);
      return res.status(500).json({ message: 'Lỗi khi gửi email khôi phục. Vui lòng thử lại sau.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    
    // Kiểm tra token hợp lệ
    const resetToken = await ResetToken.findOne({ userId: id, token });
    if (!resetToken) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });

    // Đổi mật khẩu
    const user = await User.findById(id);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Xóa token
    await ResetToken.deleteMany({ userId: id });

    res.json({ message: 'Mật khẩu đã được đặt lại thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
