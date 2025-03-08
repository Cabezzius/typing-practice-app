const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'El contenido del texto es requerido'],
    trim: true,
    minlength: [10, 'El texto debe tener al menos 10 caracteres']
  },
  title: {
    type: String,
    required: [true, 'El título del texto es requerido'],
    trim: true,
    maxlength: [100, 'El título no debe exceder los 100 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: [
      'fácil', 
      'intermedio', 
      'difícil', 
      'código', 
      'citas', 
      'párrafos', 
      'personalizado',
      'iniciación',
      'programación',
      'ciencia',
      'literatura',
      'profesional',
      'números',
      'símbolos'
    ]
  },
  idioma: {
    type: String,
    default: 'castellano',
    enum: ['castellano', 'inglés', 'otro']
  },
  difficulty: {
    type: Number, // 1-10, donde 10 es el más difícil
    min: 1,
    max: 10,
    default: 5
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Para los textos predeterminados del sistema
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  stats: {
    timesUsed: { type: Number, default: 0 },
    averageWPM: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índice para búsquedas más eficientes
textSchema.index({ category: 1, difficulty: 1 });
textSchema.index({ title: 'text', content: 'text' });

const Text = mongoose.model('Text', textSchema);

module.exports = Text;