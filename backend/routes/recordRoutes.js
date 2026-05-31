const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Chỉ bác sĩ mới được quyền xem hồ sơ sức khỏe dùng chung
router.get('/:patientId', authMiddleware, roleMiddleware(['doctor']), recordController.getPatientSharedRecords);

module.exports = router;
