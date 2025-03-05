import axios from 'axios';

// Crear instancia de axios con la URL base
const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de usuario
export const userService = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getStats: () => api.get('/users/stats'),
};

// Servicios de textos
export const textService = {
  getTexts: (params) => api.get('/texts', { params }),
  getTextById: (id) => api.get(`/texts/${id}`),
  createText: (textData) => api.post('/texts', textData),
  updateText: (id, textData) => api.put(`/texts/${id}`, textData),
  deleteText: (id) => api.delete(`/texts/${id}`),
  getRandomText: (params) => api.get('/texts/random', { params }),
};

// Servicios de puntuaciones
export const scoreService = {
  createScore: (scoreData) => api.post('/scores', scoreData),
  getUserScores: (params) => api.get('/scores', { params }),
  getUserDetailedStats: () => api.get('/scores/stats'),
  getLeaderboard: (params) => api.get('/scores/leaderboard', { params }),
};

export default api;