import React from 'react';
import { Link } from 'react-router-dom';
import { FaKeyboard, FaChartLine, FaTrophy, FaUserFriends } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mejora tu velocidad de escritura
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Practica mecanografía con textos en español, mide tu velocidad, mejora tu precisión
            y compite con otros usuarios.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/typing" className="btn btn-primary text-lg px-8 py-3">
              Comenzar a practicar
            </Link>
            <Link to="/register" className="btn btn-outline text-lg px-8 py-3">
              Crear una cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaKeyboard className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prácticas personalizadas</h3>
              <p className="text-gray-600">
                Practica con diferentes categorías de textos adaptados a tu nivel de habilidad.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Estadísticas detalladas</h3>
              <p className="text-gray-600">
                Analiza tu progreso con métricas como velocidad, precisión y errores comunes.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tabla de clasificación</h3>
              <p className="text-gray-600">
                Compite con otros usuarios y sube en el ranking para demostrar tus habilidades.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaUserFriends className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidad activa</h3>
              <p className="text-gray-600">
                Comparte tus propios textos y aprovecha los contenidos creados por la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-secondary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-secondary-600 font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Selecciona un texto</h3>
              <p className="text-gray-600">
                Elige entre diferentes categorías y niveles de dificultad según tus preferencias y habilidades.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-secondary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-secondary-600 font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Practica escribiendo</h3>
              <p className="text-gray-600">
                Escribe el texto mostrado lo más rápido y preciso posible. La aplicación seguirá tu progreso en tiempo real.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="bg-secondary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-secondary-600 font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Analiza tus resultados</h3>
              <p className="text-gray-600">
                Al terminar, verás estadísticas detalladas sobre tu desempeño y podrás identificar áreas de mejora.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/typing" className="btn btn-primary">
              Comenzar ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;