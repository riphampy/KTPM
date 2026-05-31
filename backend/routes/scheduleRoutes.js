const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['doctor']), scheduleController.createSchedule);
router.get('/all', authMiddleware, roleMiddleware(['admin']), scheduleController.getAllSchedules);
router.get('/doctor/:doctorId', scheduleController.getDoctorSchedules);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'doctor']), scheduleController.deleteSchedule);

module.exports = router;
