const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Verificación de dependencias
console.log('User model loaded:', !!User);
console.log('JWT loaded:', !!jwt);

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si ya existe el usuario
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'El usuario o email ya está registrado' 
      });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        stats: user.stats,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      message: 'Error al crear usuario', 
      error: error.message 
    });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      stats: user.stats,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión', 
      error: error.message 
    });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      stats: user.stats,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil de usuario', 
      error: error.message 
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { username, email, password } = req.body;

    // Actualizar campos si se proporcionan
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      stats: updatedUser.stats,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      message: 'Error al actualizar perfil de usuario', 
      error: error.message 
    });
  }
};

// @desc    Obtener estadísticas del usuario
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user.stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas de usuario', 
      error: error.message 
    });
  }
};