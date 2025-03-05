const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Text = require('../models/textModel');
const User = require('../models/userModel');

// Configuración
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/typingapp';

// Textos de ejemplo
const sampleTexts = [
  {
    title: 'El Principito - Introducción',
    content: 'Cuando yo tenía seis años vi en un libro sobre la selva virgen que se titulaba "Historias vividas", una magnífica lámina. Representaba una serpiente boa que se tragaba a una fiera. En el libro se afirmaba: "La serpiente boa se traga su presa entera, sin masticarla. Luego ya no puede moverse y duerme durante los seis meses que dura su digestión".',
    category: 'fácil',
    language: 'español',
    difficulty: 3,
    isPublic: true
  },
  {
    title: 'Don Quijote - Capítulo 1',
    content: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.',
    category: 'intermedio',
    language: 'español',
    difficulty: 6,
    isPublic: true
  },
  {
    title: 'Ejercicio de programación',
    content: 'function calculaFibonacci(n) {\n  if (n <= 1) return n;\n  return calculaFibonacci(n-1) + calculaFibonacci(n-2);\n}\n\nconst resultado = calculaFibonacci(10);\nconsole.log(`El décimo número de Fibonacci es: ${resultado}`);',
    category: 'código',
    language: 'español',
    difficulty: 7,
    isPublic: true
  },
  {
    title: 'Cien años de soledad - Inicio',
    content: 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos.',
    category: 'difícil',
    language: 'español',
    difficulty: 8,
    isPublic: true
  },
  {
    title: 'Práctica simple',
    content: 'El sol brilla en el cielo. Los pájaros cantan en los árboles. El viento sopla suavemente. Las flores crecen en el jardín. Los niños juegan en el parque. La música suena en la radio. El café está caliente y delicioso.',
    category: 'fácil',
    language: 'español',
    difficulty: 1,
    isPublic: true
  }
];

// Usuario admin para empezar
const sampleAdmin = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Función para poblar la base de datos
const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado para sembrar datos');

    // Limpiar colecciones existentes
    await Text.deleteMany({});
    console.log('Colección de textos limpiada');
    
    await User.deleteMany({});
    console.log('Colección de usuarios limpiada');

    // Crear usuario admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sampleAdmin.password, salt);
    
    const adminUser = await User.create({
      ...sampleAdmin,
      password: hashedPassword
    });
    console.log('Usuario admin creado:', adminUser.email);

    // Crear textos
    const createdTexts = await Text.insertMany(sampleTexts);
    console.log(`${createdTexts.length} textos de ejemplo creados`);

    console.log('Datos sembrados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al sembrar datos:', error);
    process.exit(1);
  }
};

// Ejecutar función de sembrado
seedDatabase();