import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaKeyboard, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-600">
            <FaKeyboard className="text-2xl" />
            <span className="text-xl font-bold">TypeMaster</span>
          </Link>

          {/* Navegación para escritorio */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/typing" className="text-gray-700 hover:text-primary-600 transition-colors">
              Practicar
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-primary-600 transition-colors">
              Clasificación
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/stats" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Estadísticas
                </Link>
                <Link to="/texts" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Textos
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 focus:outline-none">
                    <FaUser />
                    <span>{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>

          {/* Botón de menú móvil */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/typing" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                Practicar
              </Link>
              <Link 
                to="/leaderboard" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                Clasificación
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/stats" 
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                    onClick={closeMenu}
                  >
                    Estadísticas
                  </Link>
                  <Link 
                    to="/texts" 
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                    onClick={closeMenu}
                  >
                    Textos
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                    onClick={closeMenu}
                  >
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors py-2"
                  >
                    <FaSignOutAlt />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link 
                    to="/login" 
                    className="btn btn-outline w-full text-center"
                    onClick={closeMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary w-full text-center"
                    onClick={closeMenu}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;