import React from 'react';
import TypingTest from '../components/typing/TypingTest';

const TypingPage = () => {
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