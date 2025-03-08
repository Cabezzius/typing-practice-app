const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor proporciona un nombre de usuario'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [20, 'El nombre de usuario no debe exceder los 20 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor proporciona un email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor proporciona un email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor proporciona una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  stats: {
    averageWPM: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    testsCompleted: { type: Number, default: 0 },
    totalTimePracticed: { type: Number, default: 0 } // en segundos
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;