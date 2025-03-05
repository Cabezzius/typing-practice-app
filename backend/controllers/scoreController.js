const Score = require('../models/scoreModel');
const User = require('../models/userModel');
const Text = require('../models/textModel');
const mongoose = require('mongoose');

// @desc    Registrar una nueva puntuación
// @route   POST /api/scores
// @access  Private
exports.createScore = async (req, res) => {
  try {
    const { textId, wpm, accuracy, errors, time, characters } = req.body;

    // Crear nueva puntuación
    const score = await Score.create({
      user: req.user._id,
      text: textId,
      wpm,
      accuracy,
      errors,
      time,
      characters
    });

    // Actualizar estadísticas del usuario
    const user = await User.findById(req.user._id);
    
    // Calcular nuevos promedios
    const newTestsCompleted = user.stats.testsCompleted + 1;
    const newAverageWPM = ((user.stats.averageWPM * user.stats.testsCompleted) + wpm) / newTestsCompleted;
    const newAverageAccuracy = ((user.stats.averageAccuracy * user.stats.testsCompleted) + accuracy) / newTestsCompleted;
    const newTotalTimePracticed = user.stats.totalTimePracticed + time;

    // Actualizar estadísticas del usuario
    user.stats = {
      averageWPM: parseFloat(newAverageWPM.toFixed(2)),
      averageAccuracy: parseFloat(newAverageAccuracy.toFixed(2)),
      testsCompleted: newTestsCompleted,
      totalTimePracticed: newTotalTimePracticed
    };
    await user.save();

    // Actualizar estadísticas del texto
    const text = await Text.findById(textId);
    if (text) {
      const newTimesUsed = text.stats.timesUsed + 1;
      const newTextAverageWPM = ((text.stats.averageWPM * text.stats.timesUsed) + wpm) / newTimesUsed;
      const newTextAverageAccuracy = ((text.stats.averageAccuracy * text.stats.timesUsed) + accuracy) / newTimesUsed;

      text.stats = {
        timesUsed: newTimesUsed,
        averageWPM: parseFloat(newTextAverageWPM.toFixed(2)),
        averageAccuracy: parseFloat(newTextAverageAccuracy.toFixed(2))
      };
      await text.save();
    }

    res.status(201).json(score);
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
    const { 
      limit = 10, 
      page = 1,
      sort = '-date' // Por defecto, ordenar por fecha descendente
    } = req.query;

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Construir el ordenamiento
    const sortObj = {};
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortDirection = sort.startsWith('-') ? -1 : 1;
    sortObj[sortField] = sortDirection;

    // Obtener puntuaciones con paginación y ordenamiento
    const scores = await Score.find({ user: req.user._id })
      .populate('text', 'title category difficulty')
      .skip(skip)
      .limit(Number(limit))
      .sort(sortObj);

    // Contar total de documentos para info de paginación
    const total = await Score.countDocuments({ user: req.user._id });

    res.json({
      scores,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
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
    // Estadísticas generales
    const generalStats = await Score.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgWPM: { $avg: '$wpm' },
          maxWPM: { $max: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalTimeSpent: { $sum: '$time' },
          totalErrors: { $sum: '$errors' }
        }
      }
    ]);

    // Progreso en el tiempo (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressStats = await Score.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          averageWPM: { $avg: '$wpm' },
          averageAccuracy: { $avg: '$accuracy' },
          testsCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Rendimiento por categoría
    const categoryStats = await Score.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user._id) }
      },
      {
        $lookup: {
          from: 'texts',
          localField: 'text',
          foreignField: '_id',
          as: 'textDetails'
        }
      },
      { $unwind: '$textDetails' },
      {
        $group: {
          _id: '$textDetails.category',
          averageWPM: { $avg: '$wpm' },
          averageAccuracy: { $avg: '$accuracy' },
          testsCount: { $sum: 1 }
        }
      },
      { $sort: { 'averageWPM': -1 } }
    ]);

    // Mejores puntuaciones
    const topScores = await Score.find({ user: req.user._id })
      .populate('text', 'title category')
      .sort({ wpm: -1 })
      .limit(5);

    res.json({
      generalStats: generalStats[0] || {
        totalTests: 0,
        avgWPM: 0,
        maxWPM: 0,
        avgAccuracy: 0,
        totalTimeSpent: 0,
        totalErrors: 0
      },
      progressStats,
      categoryStats,
      topScores
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
    const { limit = 10, period = 'all' } = req.query;
    
    let dateFilter = {};
    
    // Filtrar por período
    if (period !== 'all') {
      const startDate = new Date();
      if (period === 'day') {
        startDate.setDate(startDate.getDate() - 1);
      } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      }
      dateFilter = { date: { $gte: startDate } };
    }

    // Obtener el promedio de WPM por usuario
    const leaderboard = await Score.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: '$user',
          averageWPM: { $avg: '$wpm' },
          averageAccuracy: { $avg: '$accuracy' },
          testsCount: { $sum: 1 },
          bestWPM: { $max: '$wpm' }
        }
      },
      { $sort: { averageWPM: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          username: '$userDetails.username',
          averageWPM: 1,
          averageAccuracy: 1,
          testsCount: 1,
          bestWPM: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    res.status(500).json({ 
      message: 'Error al obtener tabla de clasificación', 
      error: error.message 
    });
  }
};