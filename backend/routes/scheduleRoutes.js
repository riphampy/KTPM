const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['doctor']), scheduleController.createSchedule);
router.get('/doctor/:doctorId', scheduleController.getDoctorSchedules);

module.exports = router;
