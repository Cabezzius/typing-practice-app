const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Debug
console.log('Text controller loaded:', !!textController);
console.log('Text controller functions:', Object.keys(textController));

// Rutas públicas y semi-públicas (pueden usar autenticación opcional)
router.get('/', optionalAuth, textController.getTexts);
router.get('/random', textController.getRandomText);
router.get('/:id', optionalAuth, textController.getTextById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, textController.createText);
router.put('/:id', protect, textController.updateText);
router.delete('/:id', protect, textController.deleteText);

module.exports = router;