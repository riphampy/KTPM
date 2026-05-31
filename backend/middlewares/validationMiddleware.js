const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name').notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải từ 6 ký tự trở lên'),
  body('role').optional().isIn(['patient', 'doctor', 'admin']).withMessage('Vai trò không hợp lệ'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  }
];
