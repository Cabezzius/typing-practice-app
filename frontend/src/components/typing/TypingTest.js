import React, { useEffect, useRef, useState } from 'react';
import { FaRedo, FaStopwatch, FaKeyboard, FaBullseye } from 'react-icons/fa';
import { useTyping } from '../../contexts/TypingContext';

const TypingTest = () => {
  const {
    text,
    loading,
    typedText,
    isActive,
    currentPosition,
    errors,
    correctChars,
    results,
    startTime,
    getRandomText,
    handleTyping,
    resetTypingState,
    textCategory,
    changeCategory
  } = useTyping();

  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0
  });

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Categorías disponibles
  const categories = [
    { value: 'fácil', label: 'Fácil' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'difícil', label: 'Difícil' },
    { value: 'código', label: 'Código' },
    { value: 'citas', label: 'Citas' },
    { value: 'párrafos', label: 'Párrafos' }
  ];

  // Enfocar el input cuando cambia el texto o se reinicia
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [text]);

  // Timer para actualizar estadísticas en tiempo real
  useEffect(() => {
    if (isActive && startTime) {
      timerRef.current = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000;
        const wpm = Math.round((correctChars / 5) / (timeElapsed / 60) || 0);
        const accuracy = currentPosition > 0 
          ? Math.round((correctChars / currentPosition) * 100) 
          : 100;

        setStats({
          wpm,
          accuracy,
          timeElapsed: Math.round(timeElapsed)
        });
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, startTime, correctChars, currentPosition]);

  // Manejar eventos de teclado
  const handleKeyDown = (e) => {
    // Prevenir el comportamiento por defecto para ciertas teclas
    if (e.key === 'Tab') {
      e.preventDefault();
    }

    // Procesar la tecla presionada
    handleTyping(e.key);
  };

  // Cambiar la categoría de texto
  const handleCategoryChange = (e) => {
    changeCategory(e.target.value);
  };

  // Reiniciar la prueba
  const handleReset = () => {
    resetTypingState();
    getRandomText(textCategory);
  };

  // Renderizar texto con caracteres marcados como correctos/incorrectos
  const renderText = () => {
    if (!text) return null;

    return text.content.split('').map((char, index) => {
      let className = '';
      
      if (index < typedText.length) {
        // Carácter ya escrito
        className = typedText[index] === char ? 'correct-char' : 'incorrect-char';
      } else if (index === currentPosition) {
        // Posición actual
        className = 'current-char';
      }
      
      // Espacios en blanco y saltos de línea necesitan un manejo especial
      if (char === ' ') {
        return (
          <span key={index} className={className}>
            {'\u00A0'}
          </span>
        );
      } else if (char === '\n') {
        return <br key={index} />;
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Renderizar resultados finales
  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">¡Prueba completada!</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
            <FaKeyboard className="text-primary-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Velocidad</p>
              <p className="text-2xl font-bold">{results.wpm} PPM</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
            <FaBullseye className="text-primary-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Precisión</p>
              <p className="text-2xl font-bold">{results.accuracy}%</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
            <FaStopwatch className="text-primary-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Tiempo</p>
              <p className="text-2xl font-bold">{Math.round(results.time)}s</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleReset}
            className="btn btn-primary flex items-center justify-center mx-auto"
          >
            <FaRedo className="mr-2" />
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="typing-test">
      {/* Resultados */}
      {results && renderResults()}

      {/* Controles superiores */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Selector de categoría */}
        <div className="w-full md:w-auto">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category"
            value={textCategory}
            onChange={handleCategoryChange}
            className="input-field"
            disabled={isActive}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estadísticas en tiempo real */}
        {isActive && (
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Velocidad</p>
              <p className="text-xl font-bold">{stats.wpm} PPM</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Precisión</p>
              <p className="text-xl font-bold">{stats.accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Tiempo</p>
              <p className="text-xl font-bold">{stats.timeElapsed}s</p>
            </div>
          </div>
        )}

        {/* Botón de reinicio */}
        {!isActive && !results && (
          <button
            onClick={handleReset}
            className="btn btn-outline flex items-center"
          >
            <FaRedo className="mr-2" />
            Cambiar texto
          </button>
        )}
      </div>

      {/* Título del texto */}
      {text && (
        <h3 className="text-xl font-semibold mb-2">{text.title}</h3>
      )}

      {/* Área de texto para escribir */}
      <div 
        className="card mb-6 relative"
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        <div className="card-body">
          <div className="typing-text relative">
            {renderText()}
          </div>
          
          {/* Input oculto para capturar pulsaciones de teclas */}
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute inset-0 w-full h-full cursor-default"
            onKeyDown={handleKeyDown}
            readOnly
          />
        </div>
      </div>

      {/* Instrucciones */}
      {!isActive && !results && (
        <div className="text-center text-gray-600 italic">
          Haz clic en el texto y comienza a escribir para iniciar la prueba.
        </div>
      )}
    </div>
  );
};

export default TypingTest;