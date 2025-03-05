const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Rutas públicas y semi-públicas (pueden usar autenticación opcional)
router.get('/', optionalAuth, textController.getTexts);
router.get('/random', textController.getRandomText);
router.get('/:id', optionalAuth, textController.getTextById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, textController.createText);
router.put('/:id', protect, textController.updateText);
router.delete('/:id', protect, textController.deleteText);

module.exports = router;