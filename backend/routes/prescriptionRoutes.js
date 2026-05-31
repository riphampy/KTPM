const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['doctor']), prescriptionController.createPrescription);
router.get('/patient/:patientId', authMiddleware, prescriptionController.getPatientPrescriptions);

module.exports = router;
