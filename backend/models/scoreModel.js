const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Text',
    required: true
  },
  wpm: {
    type: Number,
    required: true,
    min: 0
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  errors: {
    type: Number,
    default: 0,
    min: 0
  },
  time: {
    type: Number, // Tiempo en segundos
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  characters: {
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índices para rendimiento
scoreSchema.index({ user: 1, date: -1 });
scoreSchema.index({ user: 1, wpm: -1 });
scoreSchema.index({ text: 1, wpm: -1 });

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;