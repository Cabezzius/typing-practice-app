import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { textService, scoreService } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TypingContext = createContext();

export function useTyping() {
  return useContext(TypingContext);
}

export const TypingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Estado para la práctica de mecanografía
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textCategory, setTextCategory] = useState('fácil');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [results, setResults] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now()); // Para forzar actualizaciones

  // Función para obtener un texto aleatorio
  const getRandomText = useCallback(async (category = textCategory) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Obteniendo texto aleatorio, categoría enviada a API:', category);
      
      // Asegúrate de que la categoría se está pasando correctamente
      const params = { category };
      console.log('Parámetros enviados a API:', params);
      
      const { data } = await textService.getRandomText(params);
      console.log('Texto recibido de API:', data);
      
      // Verificar si el texto es diferente del actual
      if (text && text._id === data._id) {
        console.log('El texto recibido es el mismo, intentando obtener otro');
        // Añadir timestamp para romper caché
        const { data: newData } = await textService.getRandomText({ 
          ...params, 
          _t: Date.now() 
        });
        console.log('Nuevo texto recibido:', newData);
        setText(newData);
        setLastUpdated(Date.now());
      } else {
        setText(data);
        setLastUpdated(Date.now());
      }
      
      resetTypingState();
      return data;
    } catch (error) {
      console.error('Error completo al obtener texto:', error);
      const message = error.response?.data?.message || 'Error al obtener texto';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [textCategory, text]);

  // Cargar un texto aleatorio al montar el componente o cambiar la categoría
  useEffect(() => {
    getRandomText(textCategory);
  }, [textCategory]); // Quité getRandomText de las dependencias para evitar bucles

  // Reiniciar el estado de la práctica de mecanografía
  const resetTypingState = () => {
    setTypedText('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setCurrentPosition(0);
    setErrors(0);
    setCorrectChars(0);
    setResults(null);
  };

  // Función para comenzar la práctica
  const startTyping = () => {
    resetTypingState();
    setStartTime(Date.now());
    setIsActive(true);
  };

  // Función para finalizar la práctica
  const finishTyping = useCallback(() => {
    if (!isActive || !text) return;
    
    const endTimeValue = Date.now();
    setEndTime(endTimeValue);
    setIsActive(false);

    // Calcular resultados
    const timeInSeconds = (endTimeValue - startTime) / 1000;
    const accuracy = ((correctChars / Math.max(currentPosition, 1)) * 100).toFixed(2);
    const wpm = Math.round((correctChars / 5) / (timeInSeconds / 60));

    const typingResults = {
      wpm,
      accuracy: parseFloat(accuracy),
      errors,
      time: timeInSeconds,
      characters: {
        total: currentPosition,
        correct: correctChars,
        incorrect: errors
      }
    };

    setResults(typingResults);

    // Guardar resultados si el usuario está autenticado
    if (isAuthenticated && user && text) {
      saveScore({
        ...typingResults,
        textId: text._id
      });
    }
  }, [isActive, startTime, text, correctChars, currentPosition, errors, isAuthenticated, user]);

  // Verificar si se ha completado el texto
  useEffect(() => {
    if (isActive && text && typedText.length === text.content.length) {
      finishTyping();
    }
  }, [isActive, text, typedText, finishTyping]);

  // Función para procesar cada tecla presionada
  const handleTyping = (key) => {
    if (!isActive && key.length === 1) {
      // Iniciar si es el primer carácter
      startTyping();
    }

    if (!isActive || !text) return;

    if (currentPosition < text.content.length) {
      // Si es un carácter normal
      if (key.length === 1) {
        const expectedChar = text.content[currentPosition];
        const isCorrect = key === expectedChar;

        setTypedText(prev => prev + key);
        setCurrentPosition(prev => prev + 1);

        if (isCorrect) {
          setCorrectChars(prev => prev + 1);
        } else {
          setErrors(prev => prev + 1);
        }
      }
      // Manejar tecla de retroceso (no permitido en versión básica)
      // else if (key === 'Backspace') {...}
    }
  };

  // Guardar la puntuación en la base de datos
  const saveScore = async (scoreData) => {
    try {
      await scoreService.createScore(scoreData);
      toast.success('Puntuación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar puntuación:', error);
      toast.error('Error al guardar puntuación');
    }
  };

  // Obtener texto por ID
  const getTextById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Obteniendo texto específico, ID:', id);
      const { data } = await textService.getTextById(id);
      console.log('Texto recibido:', data);
      
      setText(data);
      resetTypingState();
      
      return data;
    } catch (error) {
      console.error('Error al obtener texto específico:', error);
      const message = error.response?.data?.message || 'Error al obtener texto';
      setError(message);
      toast.error(message);
      // Si hay error, redirigir a la página principal de práctica
      navigate('/typing');
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Cambiar la categoría de texto
  const changeCategory = (category) => {
    console.log('Cambiando categoría a:', category);
    if (category === textCategory) {
      // Si es la misma categoría, forzar obtener un nuevo texto
      console.log('Misma categoría, forzando nuevo texto');
      getRandomText(category);
    } else {
      setTextCategory(category);
      // El useEffect se encargará de cargar un nuevo texto
    }
  };

  // Valor del contexto
  const value = {
    text,
    loading,
    error,
    textCategory,
    typedText,
    isActive,
    currentPosition,
    errors,
    correctChars,
    results,
    startTime,
    endTime,
    lastUpdated,
    getRandomText,
    getTextById,
    handleTyping,
    startTyping,
    finishTyping,
    resetTypingState,
    changeCategory
  };
  
  return (
    <TypingContext.Provider value={value}>
      {children}
    </TypingContext.Provider>
  );
};

export default TypingContext;