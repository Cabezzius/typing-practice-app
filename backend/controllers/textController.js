const Text = require('../models/textModel');

// @desc    Obtener todos los textos (con filtros opcionales)
// @route   GET /api/texts
// @access  Public
exports.getTexts = async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      language, 
      limit = 10, 
      page = 1,
      search
    } = req.query;

    const queryObj = {};

    // Aplicar filtros si existen
    if (category) queryObj.category = category;
    if (difficulty) queryObj.difficulty = Number(difficulty);
    if (language) queryObj.language = language;
    
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

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Realizar la consulta con paginación
    const texts = await Text.find(queryObj)
      .skip(skip)
      .limit(Number(limit))
      .sort({ difficulty: 1, createdAt: -1 });

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
exports.getTextById = async (req, res) => {
  try {
    const text = await Text.findById(req.params.id);

    if (!text) {
      return res.status(404).json({ message: 'Texto no encontrado' });
    }

    // Verificar si el texto es privado y si el usuario tiene acceso
    if (!text.isPublic && (!req.user || text.createdBy.toString() !== req.user._id.toString())) {
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
    const { title, content, category, language, difficulty, isPublic } = req.body;

    // Crear texto
    const text = await Text.create({
      title,
      content,
      category,
      language: language || 'español',
      difficulty: difficulty || 5,
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user._id
    });

    res.status(201).json(text);
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
    const text = await Text.findById(req.params.id);

    if (!text) {
      return res.status(404).json({ message: 'Texto no encontrado' });
    }

    // Verificar propiedad (solo el creador o admin puede editar)
    if (text.createdBy && text.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para editar este texto' });
    }

    const { title, content, category, language, difficulty, isPublic } = req.body;

    // Actualizar campos si se proporcionan
    if (title) text.title = title;
    if (content) text.content = content;
    if (category) text.category = category;
    if (language) text.language = language;
    if (difficulty !== undefined) text.difficulty = difficulty;
    if (isPublic !== undefined) text.isPublic = isPublic;

    const updatedText = await text.save();
    res.json(updatedText);
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
    const text = await Text.findById(req.params.id);

    if (!text) {
      return res.status(404).json({ message: 'Texto no encontrado' });
    }

    // Verificar propiedad (solo el creador o admin puede eliminar)
    if (text.createdBy && text.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este texto' });
    }

    await text.deleteOne();
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
exports.getRandomText = async (req, res) => {
  try {
    const { category, difficulty, language } = req.query;
    
    const query = { isPublic: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = Number(difficulty);
    if (language) query.language = language;

    // Contar documentos para asegurar que hay textos disponibles
    const count = await Text.countDocuments(query);
    
    if (count === 0) {
      return res.status(404).json({ message: 'No hay textos disponibles con esos criterios' });
    }

    // Obtener un texto aleatorio
    const random = Math.floor(Math.random() * count);
    const text = await Text.findOne(query).skip(random);
    
    res.json(text);
  } catch (error) {
    console.error('Error al obtener texto aleatorio:', error);
    res.status(500).json({ 
      message: 'Error al obtener texto aleatorio', 
      error: error.message 
    });
  }
};