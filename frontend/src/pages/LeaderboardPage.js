import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaExclamationTriangle } from 'react-icons/fa';
import { scoreService } from '../services/api';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');

  // Períodos disponibles
  const periods = [
    { value: 'all', label: 'Todo el tiempo' },
    { value: 'month', label: 'Este mes' },
    { value: 'week', label: 'Esta semana' },
    { value: 'day', label: 'Hoy' }
  ];

  // Cargar tabla de clasificación
  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  // Función para obtener la tabla de clasificación
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await scoreService.getLeaderboard({ 
        period,
        limit: 50 // Obtener los 50 mejores
      });

      setLeaderboard(data);
    } catch (error) {
      console.error('Error al cargar tabla de clasificación:', error);
      setError('No se pudo cargar la tabla de clasificación. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener ícono según la posición
  const getRankIcon = (position) => {
    switch (position) {
      case 0:
        return <FaTrophy className="text-yellow-500 text-xl" />;
      case 1:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 2:
        return <FaMedal className="text-yellow-700 text-xl" />;
      default:
        return <FaAward className="text-blue-500 text-xl" />;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tabla de Clasificación</h1>
      
      {/* Selector de período */}
      <div className="mb-6">
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
          Período
        </label>
        <div className="sm:w-64">
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <div className="flex">
            <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaTrophy className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No hay datos disponibles</h2>
          <p className="text-gray-600">
            Todavía no hay suficientes usuarios que hayan completado pruebas de mecanografía en este período.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Velocidad media
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mejor velocidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precisión media
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pruebas completadas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((user, index) => (
                  <tr key={user._id} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{index + 1}</span>
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {Math.round(user.averageWPM)} PPM
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {Math.round(user.bestWPM)} PPM
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.averageAccuracy.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.testsCount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Información sobre la tabla de clasificación */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Cómo funciona la clasificación?</h3>
        <p className="text-blue-700">
          La clasificación se basa en la velocidad media (palabras por minuto) de los usuarios. 
          Para aparecer en la tabla, debes completar al menos una prueba de mecanografía. 
          Puedes filtrar por diferentes períodos para ver quién ha sido el más rápido recientemente.
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;