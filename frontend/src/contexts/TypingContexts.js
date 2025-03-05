import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { textService, scoreService } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const TypingContext = createContext();

export function useTyping() {
  return useContext(TypingContext);
}

export const TypingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
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

  // Función para obtener un texto aleatorio
  const getRandomText = useCallback(async (category = textCategory) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await textService.getRandomText({ category });
      setText(data);
      resetTypingState();
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener texto';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [textCategory]);

  // Cargar un texto aleatorio al montar el componente o cambiar la categoría
  useEffect(() => {
    getRandomText();
  }, [getRandomText]);

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
    if (!isActive) return;
    
    const endTimeValue = Date.now();
    setEndTime(endTimeValue);
    setIsActive(false);

    // Calcular resultados
    const timeInSeconds = (endTimeValue - startTime) / 1000;
    const totalChars = text.content.length;
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

    if (!isActive) return;

    if (text && currentPosition < text.content.length) {
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

  // Cambiar la categoría de texto
  const changeCategory = (category) => {
    setTextCategory(category);
    getRandomText(category);
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
    getRandomText,
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