const Text = require('../models/textModel');

// Funciones temporales para test

// @desc    Obtener todos los textos (con filtros opcionales)
// @route   GET /api/texts
// @access  Public
exports.getTexts = async (req, res) => {
    try {
      const { 
        category, 
        difficulty, 
        idioma, // o idioma, según lo que hayas cambiado
        limit = 10, 
        page = 1,
        search
      } = req.query;
  
      const queryObj = {};
  
      // Agrega esto para depuración
      console.log('Query params recibidos:', req.query);
  
      // Aplicar filtros si existen
      if (category) queryObj.category = category;
      if (difficulty) queryObj.difficulty = Number(difficulty);
      if (idioma) queryObj.idioma = idioma; // o idioma
      
      // Búsqueda por texto
      if (search) {
        queryObj.$text = { $search: search };
      }
  
      // Textos públicos o creados por el usuario actual
      queryObj.$or = [
        { isPublic: true },
        // Si el usuario está autenticado, incluir también sus textos privados
        ...(req.user ? [{ createdBy: req.user._id }] : [])
      ];
  
      // Log para depuración
      console.log('Query a MongoDB:', queryObj);
  
      // Calcular skip para paginación
      const skip = (page - 1) * limit;
  
      // Realizar la consulta con paginación
      const texts = await Text.find(queryObj)
        .skip(skip)
        .limit(Number(limit))
        .sort({ difficulty: 1, createdAt: -1 });
  
      // Log para depuración
      console.log('Textos encontrados:', texts.length);
  
      // Contar total de documentos para info de paginación
      const total = await Text.countDocuments(queryObj);
  
      res.json({
        texts,
        page: Number(page),
        pages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      console.error('Error al obtener textos:', error);
      res.status(500).json({ 
        message: 'Error al obtener textos', 
        error: error.message 
      });
    }
  };
// @desc    Obtener un texto específico por ID
// @route   GET /api/texts/:id
// @access  Public
// En backend/controllers/textController.js, asegúrate de que getTextById funcione correctamente
exports.getTextById = async (req, res) => {
    try {
      console.log('Buscando texto con ID:', req.params.id);
      
      const text = await Text.findById(req.params.id);
  
      if (!text) {
        return res.status(404).json({ message: 'Texto no encontrado' });
      }
  
      // Verificar si el texto es privado y si el usuario tiene acceso
      if (!text.isPublic && (!req.user || text.createdBy?.toString() !== req.user._id.toString())) {
        return res.status(403).json({ message: 'No tienes permiso para acceder a este texto' });
      }
  
      res.json(text);
    } catch (error) {
      console.error('Error al obtener texto por ID:', error);
      res.status(500).json({ 
        message: 'Error al obtener el texto', 
        error: error.message 
      });
    }
  };

// @desc    Crear un nuevo texto
// @route   POST /api/texts
// @access  Private
exports.createText = async (req, res) => {
  try {
    res.status(201).json({
      _id: '123',
      title: req.body.title || 'Texto de prueba',
      content: req.body.content || 'Este es un texto de prueba',
      category: req.body.category || 'fácil',
      idioma: req.body.idioma || 'castellano',
      difficulty: req.body.difficulty || 1,
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true
    });
  } catch (error) {
    console.error('Error al crear texto:', error);
    res.status(500).json({ 
      message: 'Error al crear el texto', 
      error: error.message 
    });
  }
};

// @desc    Actualizar un texto
// @route   PUT /api/texts/:id
// @access  Private
exports.updateText = async (req, res) => {
  try {
    res.json({
      _id: req.params.id,
      title: req.body.title || 'Texto actualizado',
      content: req.body.content || 'Este es un texto actualizado',
      category: req.body.category || 'fácil',
      idioma: req.body.idioma || 'castellano',
      difficulty: req.body.difficulty || 1,
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true
    });
  } catch (error) {
    console.error('Error al actualizar texto:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el texto', 
      error: error.message 
    });
  }
};

// @desc    Eliminar un texto
// @route   DELETE /api/texts/:id
// @access  Private
exports.deleteText = async (req, res) => {
  try {
    res.json({ message: 'Texto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar texto:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el texto', 
      error: error.message 
    });
  }
};

// @desc    Obtener textos aleatorios por categoría
// @route   GET /api/texts/random
// @access  Public
// backend/controllers/textController.js
exports.getRandomText = async (req, res) => {
  try {
    const { category, difficulty, language } = req.query;
    
    console.log('Backend: solicitud de texto aleatorio recibida con parámetros:', req.query);
    
    // Comprobar si hay textos reales en la base de datos
    const totalTexts = await Text.countDocuments();
    console.log('Total de textos en la base de datos:', totalTexts);
    
    if (totalTexts === 0) {
      console.log('No hay textos en la base de datos, devolviendo texto de prueba');
      // Si no hay textos, devolver texto de prueba pero con ID aleatorio para evitar repetición
      return res.json({
        _id: Date.now().toString(), // ID dinámico basado en timestamp
        title: `Texto de prueba (${category || 'general'})`,
        content: `Este es un texto de prueba para la categoría "${category || 'general'}". No hay textos reales disponibles en la base de datos para esta categoría. Por favor, añade algunos textos usando la función de administración.`,
        category: category || 'fácil',
        language: language || 'español',
        difficulty: difficulty || 5,
        isPublic: true
      });
    }
    
    // Consulta real a la base de datos
    const query = { isPublic: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = Number(difficulty);
    if (language) query.language = language;
    
    // Añadir _id diferente para forzar textos distintos
    query._id = { $ne: req.query.lastId };

    console.log('Backend: consultando con query:', query);

    // Contar documentos para asegurar que hay textos disponibles
    const count = await Text.countDocuments(query);
    console.log('Backend: textos disponibles para la consulta:', count);
    
    if (count === 0) {
      console.log('Backend: no hay textos disponibles para estos criterios, buscando sin filtros');
      // Si no hay textos para esta categoría, intentar sin filtros
      const alternativeText = await Text.findOne();
      
      if (alternativeText) {
        console.log('Backend: devolviendo texto alternativo:', alternativeText.title);
        return res.json(alternativeText);
      } else {
        console.log('Backend: no hay textos disponibles en absoluto');
        return res.status(404).json({ message: 'No hay textos disponibles' });
      }
    }

    // Obtener un texto aleatorio
    const random = Math.floor(Math.random() * count);
    console.log('Backend: índice aleatorio seleccionado:', random);
    
    const text = await Text.findOne(query).skip(random);
    console.log('Backend: texto seleccionado:', text?.title);
    
    if (!text) {
      console.log('Backend: no se encontró texto a pesar del recuento positivo');
      return res.status(404).json({ message: 'No se pudo obtener un texto' });
    }
    
    res.json(text);
  } catch (error) {
    console.error('Backend: error al obtener texto aleatorio:', error);
    res.status(500).json({ 
      message: 'Error al obtener texto aleatorio', 
      error: error.message 
    });
  }
};