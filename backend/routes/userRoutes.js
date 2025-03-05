const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/', userController.registerUser);
router.post('/login', userController.loginUser);

// Rutas protegidas (requieren autenticación)
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.get('/stats', protect, userController.getUserStats);

module.exports = router;