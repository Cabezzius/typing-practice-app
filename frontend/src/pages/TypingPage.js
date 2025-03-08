import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TypingTest from '../components/typing/TypingTest';
import { useTyping } from '../contexts/TypingContext';

const TypingPage = () => {
  const [searchParams] = useSearchParams();
  const textId = searchParams.get('textId');
  const { getTextById } = useTyping();
  
  useEffect(() => {
    if (textId) {
      // Si tenemos un ID específico, obtener ese texto
      getTextById(textId);
    }
  }, [textId, getTextById]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Práctica de Mecanografía</h1>
      
      <p className="text-gray-600 mb-6">
        Mejora tu velocidad y precisión escribiendo el texto mostrado lo más rápido posible.
        Tu puntuación se calculará en base a tu velocidad (palabras por minuto) y precisión.
      </p>
      
      <TypingTest />
    </div>
  );
};

export default TypingPage;