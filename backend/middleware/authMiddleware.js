const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para proteger rutas - verifica el token JWT
exports.protect = async (req, res, next) => {
  let token;

  // Verificar si el token está en el header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new Error('Usuario no encontrado');
      }

      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
  }
};

// Middleware para verificar roles - limita el acceso según el rol del usuario
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado, se requiere rol de administrador' });
  }
};

// Middleware opcional que intenta autenticar pero continúa si no hay token
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // No hacemos nada, simplemente continuamos sin usuario autenticado
      console.log('Token opcional inválido, continuando sin autenticación');
    }
  }

  next();
};