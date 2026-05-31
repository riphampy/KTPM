const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['patient']), appointmentController.bookAppointment);
router.get('/my', authMiddleware, appointmentController.getMyAppointments);
router.put('/:id/status', authMiddleware, roleMiddleware(['doctor', 'admin']), appointmentController.updateAppointmentStatus);

module.exports = router;
