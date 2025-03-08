import React, { useState, useEffect } from 'react';
import { textService } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaKeyboard } from 'react-icons/fa';

const TextsPage = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    idioma: ''
  });
  const [selectedText, setSelectedText] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'fácil',
    idioma: 'castellano',
    difficulty: 5,
    isPublic: true
  });

  // Categorías disponibles
  // Busca la constante de categorías y reemplázala con el mismo array actualizado:
const categories = [
    { value: 'fácil', label: 'Fácil' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'difícil', label: 'Difícil' },
    { value: 'código', label: 'Código' },
    { value: 'citas', label: 'Citas' },
    { value: 'párrafos', label: 'Párrafos' },
    { value: 'personalizado', label: 'Personalizado' },
    { value: 'iniciación', label: 'Lecciones de iniciación' },
    { value: 'programación', label: 'Programación' },
    { value: 'ciencia', label: 'Ciencia y tecnología' },
    { value: 'literatura', label: 'Literatura' },
    { value: 'profesional', label: 'Negocios y profesional' },
    { value: 'números', label: 'Números y símbolos' },
    { value: 'símbolos', label: 'Símbolos especiales' }
  ];

  // Idiomas disponibles
  const languages = [
    { value: 'castellano', label: 'Castellano' },
    { value: 'inglés', label: 'Inglés' },
    { value: 'otro', label: 'Otro' }
  ];

  // Cargar textos al montar el componente
  useEffect(() => {
    fetchTexts();
  }, [currentPage, filters, searchTerm]);

  // Función para obtener los textos
  const fetchTexts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 20,
        ...filters
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const { data } = await textService.getTexts(params);
      setTexts(data.texts);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error al cargar textos:', error);
      setError('No se pudieron cargar los textos. Por favor, intenta de nuevo más tarde.');
      toast.error('Error al cargar textos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Volver a la primera página al cambiar filtros
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Volver a la primera página al buscar
  };

  // Cambiar página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Abrir modal para crear un nuevo texto
  const handleAddNew = () => {
    setModalMode('create');
    setFormData({
      title: '',
      content: '',
      category: 'fácil',
      idioma: 'castellano',
      difficulty: 5,
      isPublic: true
    });
    setShowModal(true);
  };

  // Abrir modal para editar un texto existente
  const handleEdit = (text) => {
    setModalMode('edit');
    setSelectedText(text);
    setFormData({
      title: text.title,
      content: text.content,
      category: text.category,
      idioma: text.idioma,
      difficulty: text.difficulty,
      isPublic: text.isPublic
    });
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Guardar un nuevo texto o actualizar uno existente
  const handleSaveText = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        await textService.createText(formData);
        toast.success('Texto creado correctamente');
      } else {
        await textService.updateText(selectedText._id, formData);
        toast.success('Texto actualizado correctamente');
      }

      setShowModal(false);
      fetchTexts(); // Recargar textos
    } catch (error) {
      console.error('Error al guardar texto:', error);
      toast.error('Error al guardar texto');
    }
  };

  // Eliminar un texto
  const handleDelete = async (textId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este texto?')) {
      try {
        await textService.deleteText(textId);
        toast.success('Texto eliminado correctamente');
        fetchTexts(); // Recargar textos
      } catch (error) {
        console.error('Error al eliminar texto:', error);
        toast.error('Error al eliminar texto');
      }
    }
  };

  // Generar números de página para paginación
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(currentPage - halfMaxPages, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Textos</h1>
        <button 
          onClick={handleAddNew}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Añadir Texto
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar textos..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-500" />
                  </div>
                </div>
              </form>
            </div>

            {/* Filtro por categoría */}
            <div>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por idioma */}
            <div>
              <select
                name="idioma"
                value={filters.idioma}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Todos los idiomas</option>
                {languages.map((idioma) => (
                  <option key={idioma.value} value={idioma.value}>
                    {idioma.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de textos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-500">{error}</div>
        ) : texts.length === 0 ? (
          <div className="text-center p-12">
            <div className="text-6xl text-gray-300 mb-4">
              <FaFilter className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron textos</h3>
            <p className="text-gray-500">
              Intenta con otros filtros o crea un nuevo texto.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dificultad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idioma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {texts.map((text) => (
                <tr key={text._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {text.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {text.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {text.difficulty}/10
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {text.language}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      text.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {text.isPublic ? 'Público' : 'Privado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(text)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(text._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                      {/* Nuevo botón de práctica */}
                      <Link
                        to={`/typing?textId=${text._id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Practicar con este texto"
                      >
                        <FaKeyboard />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {!loading && texts.length > 0 && (
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === page
                    ? 'text-primary-600 border-primary-500 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}

      {/* Modal para crear/editar texto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {modalMode === 'create' ? 'Añadir nuevo texto' : 'Editar texto'}
              </h2>
              
              <form onSubmit={handleSaveText}>
                {/* Título */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  />
                </div>
                
                {/* Contenido */}
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows="6"
                    value={formData.content}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Caracteres: {formData.content.length}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Categoría */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="input-field"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Idioma */}
                  <div>
                    <label htmlFor="idioma" className="block text-sm font-medium text-gray-700 mb-1">
                      Idioma
                    </label>
                    <select
                      id="idioma"
                      name="idioma"
                      value={formData.idioma}
                      onChange={handleFormChange}
                      className="input-field"
                    >
                      {languages.map((idioma) => (
                        <option key={idioma.value} value={idioma.value}>
                          {idioma.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Dificultad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dificultad: {formData.difficulty}/10
                    </label>
                    <input
                      type="range"
                      name="difficulty"
                      min="1"
                      max="10"
                      value={formData.difficulty}
                      onChange={handleFormChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  {/* Visibilidad */}
                  <div className="flex items-center h-full">
                    <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                      />
                      Hacer público
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextsPage;