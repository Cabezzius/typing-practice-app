// Controlador temporal para puntuaciones

// @desc    Registrar una nueva puntuación
// @route   POST /api/scores
// @access  Private
exports.createScore = async (req, res) => {
    try {
      res.status(201).json({
        _id: '123',
        user: req.user._id,
        text: req.body.textId,
        wpm: req.body.wpm || 60,
        accuracy: req.body.accuracy || 95,
        errors: req.body.errors || 5,
        time: req.body.time || 60,
        characters: req.body.characters || {
          total: 300,
          correct: 285,
          incorrect: 15
        },
        date: new Date()
      });
    } catch (error) {
      console.error('Error al crear puntuación:', error);
      res.status(500).json({ 
        message: 'Error al registrar la puntuación', 
        error: error.message 
      });
    }
  };
  
  // @desc    Obtener las puntuaciones de un usuario
  // @route   GET /api/scores
  // @access  Private
  exports.getUserScores = async (req, res) => {
    try {
      res.json({
        scores: [],
        page: 1,
        pages: 0,
        total: 0
      });
    } catch (error) {
      console.error('Error al obtener puntuaciones:', error);
      res.status(500).json({ 
        message: 'Error al obtener puntuaciones', 
        error: error.message 
      });
    }
  };
  
  // @desc    Obtener estadísticas detalladas del usuario
  // @route   GET /api/scores/stats
  // @access  Private
  exports.getUserDetailedStats = async (req, res) => {
    try {
      res.json({
        generalStats: {
          totalTests: 0,
          avgWPM: 0,
          maxWPM: 0,
          avgAccuracy: 0,
          totalTimeSpent: 0,
          totalErrors: 0
        },
        progressStats: [],
        categoryStats: [],
        topScores: []
      });
    } catch (error) {
      console.error('Error al obtener estadísticas detalladas:', error);
      res.status(500).json({ 
        message: 'Error al obtener estadísticas detalladas', 
        error: error.message 
      });
    }
  };
  
  // @desc    Obtener ranking de usuarios
  // @route   GET /api/scores/leaderboard
  // @access  Public
  exports.getLeaderboard = async (req, res) => {
    try {
      res.json([
        {
          _id: '123',
          username: 'Usuario1',
          averageWPM: 75,
          averageAccuracy: 95,
          testsCount: 10,
          bestWPM: 90
        },
        {
          _id: '456',
          username: 'Usuario2',
          averageWPM: 65,
          averageAccuracy: 92,
          testsCount: 8,
          bestWPM: 80
        }
      ]);
    } catch (error) {
      console.error('Error al obtener leaderboard:', error);
      res.status(500).json({ 
        message: 'Error al obtener tabla de clasificación', 
        error: error.message 
      });
    }
  };