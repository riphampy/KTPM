const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/stats', authMiddleware, roleMiddleware(['admin']), reportController.getDashboardStats);
router.get('/export-excel', authMiddleware, roleMiddleware(['admin']), reportController.exportExcel);

module.exports = router;
