const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const textRoutes = require('./routes/textRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/typingapp';

// Logging para debugging
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('MONGO_URI:', MONGO_URI);
console.log('Routes loaded:', !!userRoutes, !!textRoutes, !!scoreRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente'))
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1);
  });

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/texts', textRoutes);
app.use('/api/scores', scoreRoutes);

// Ruta de verificación
app.get('/', (req, res) => {
  res.send('API de la aplicación de mecanografía funcionando correctamente');
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Ha ocurrido un error en el servidor', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});