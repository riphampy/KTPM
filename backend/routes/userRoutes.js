const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/doctors', userController.getDoctors);
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), userController.createUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
