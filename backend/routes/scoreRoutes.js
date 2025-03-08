const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');

// Debug
console.log('Score controller loaded:', !!scoreController);
console.log('Score controller functions:', Object.keys(scoreController));

// Rutas públicas
router.get('/leaderboard', scoreController.getLeaderboard);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, scoreController.createScore);
router.get('/', protect, scoreController.getUserScores);
router.get('/stats', protect, scoreController.getUserDetailedStats);

module.exports = router;