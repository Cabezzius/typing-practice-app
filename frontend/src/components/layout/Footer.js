import React from 'react';
import { Link } from 'react-router-dom';
import { FaKeyboard, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-white mb-4">
              <FaKeyboard className="text-2xl" />
              <span className="text-xl font-bold">TypeMaster</span>
            </Link>
            <p className="text-gray-400">
              Mejora tus habilidades de mecanografía con nuestra plataforma de práctica.
              Practica con diferentes textos, mide tu velocidad y precisión, y compite con otros usuarios.
            </p>
          </div>
          
          {/* Enlaces útiles */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/typing" className="text-gray-400 hover:text-white transition-colors">
                  Practicar
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">
                  Clasificación
                </Link>
              </li>
              <li>
                <Link to="/stats" className="text-gray-400 hover:text-white transition-colors">
                  Estadísticas
                </Link>
              </li>
              <li>
                <Link to="/texts" className="text-gray-400 hover:text-white transition-colors">
                  Textos
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contacto y redes */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p className="text-gray-400 mb-4">
              ¿Tienes alguna pregunta o sugerencia? Contáctanos o visita nuestro repositorio.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/username/typing-practice-app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} TypeMaster. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;