const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['patient']), appointmentController.bookAppointment);
router.get('/my', authMiddleware, appointmentController.getMyAppointments);
router.get('/all', authMiddleware, roleMiddleware(['admin']), appointmentController.getAllAppointments);
router.put('/:id/status', authMiddleware, roleMiddleware(['doctor', 'admin', 'patient']), appointmentController.updateAppointmentStatus);
router.put('/:id/payment-status', authMiddleware, roleMiddleware(['admin', 'doctor']), appointmentController.updatePaymentStatus);

module.exports = router;
