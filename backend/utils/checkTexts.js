// backend/utils/checkTexts.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Text = require('../models/textModel');

// Configuración
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/typingapp';

// Función para verificar textos en la base de datos
const checkTexts = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado exitosamente');

    // Contar textos por categoría
    const categoryCounts = await Text.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('Textos por categoría:');
    categoryCounts.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} textos`);
    });

    // Contar total de textos
    const totalCount = await Text.countDocuments();
    console.log(`Total de textos: ${totalCount}`);

    // Mostrar un ejemplo de texto
    if (totalCount > 0) {
      const sampleText = await Text.findOne();
      console.log('Ejemplo de texto:');
      console.log(JSON.stringify(sampleText, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error al verificar textos:', error);
    process.exit(1);
  }
};

// Ejecutar la función
checkTexts();