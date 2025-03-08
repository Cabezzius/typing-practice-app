import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario almacenado en localStorage al cargar
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          
          // Verificar token válido obteniendo el perfil
          try {
            await userService.getProfile();
          } catch (error) {
            // Si el token expiró o es inválido, hacer logout
            logout();
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await userService.login({ email, password });
      
      // Guardar usuario en el estado y localStorage
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success('¡Sesión iniciada correctamente!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await userService.register(userData);
      
      // Guardar usuario en el estado y localStorage
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success('¡Registro exitoso!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.info('Has cerrado sesión');
  };

  // Función para actualizar perfil
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      
      const { data } = await userService.updateProfile(userData);
      
      // Actualizar usuario en el estado y localStorage
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success('Perfil actualizado correctamente');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;