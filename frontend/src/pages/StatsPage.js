import React, { useState, useEffect } from 'react';
import { FaChartLine, FaTrophy, FaClock, FaExclamationTriangle, FaKeyboard } from 'react-icons/fa';
import { scoreService } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await scoreService.getUserDetailedStats();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('No se pudieron cargar las estadísticas. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <div className="flex">
          <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!stats || !stats.generalStats) {
    return (
      <div className="text-center py-12">
        <FaKeyboard className="mx-auto text-4xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No hay estadísticas disponibles</h2>
        <p className="text-gray-600">
          Necesitas completar algunas prácticas de mecanografía para ver tus estadísticas.
        </p>
      </div>
    );
  }

  // Datos para el gráfico de progreso
  const progressData = {
    labels: stats.progressStats.map(item => item._id),
    datasets: [
      {
        label: 'Velocidad (PPM)',
        data: stats.progressStats.map(item => item.averageWPM),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Precisión (%)',
        data: stats.progressStats.map(item => item.averageAccuracy),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // Opciones para el gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso en los últimos 30 días',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Datos para el gráfico de rendimiento por categoría
  const categoryData = {
    labels: stats.categoryStats.map(item => item._id),
    datasets: [
      {
        label: 'Velocidad (PPM)',
        data: stats.categoryStats.map(item => item.averageWPM),
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mis Estadísticas</h1>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full p-3 bg-blue-100 mr-4">
              <FaChartLine className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Velocidad Promedio</p>
              <p className="text-2xl font-bold">{Math.round(stats.generalStats.avgWPM)} PPM</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full p-3 bg-green-100 mr-4">
              <FaTrophy className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Velocidad Máxima</p>
              <p className="text-2xl font-bold">{Math.round(stats.generalStats.maxWPM)} PPM</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full p-3 bg-purple-100 mr-4">
              <FaKeyboard className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Precisión Promedio</p>
              <p className="text-2xl font-bold">{Math.round(stats.generalStats.avgAccuracy)}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full p-3 bg-yellow-100 mr-4">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tiempo Total</p>
              <p className="text-2xl font-bold">
                {Math.floor(stats.generalStats.totalTimeSpent / 60)} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Progreso en el tiempo */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-bold mb-4">Progreso en el tiempo</h2>
            {stats.progressStats.length > 1 ? (
              <Line data={progressData} options={chartOptions} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Necesitas más prácticas para ver tu progreso a lo largo del tiempo.
              </p>
            )}
          </div>
        </div>

        {/* Rendimiento por categoría */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-bold mb-4">Rendimiento por categoría</h2>
            {stats.categoryStats.length > 0 ? (
              <div className="space-y-4">
                {stats.categoryStats.map(category => (
                  <div key={category._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{category._id}</h3>
                      <span className="text-sm text-gray-500">
                        {category.testsCount} {category.testsCount === 1 ? 'prueba' : 'pruebas'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        Velocidad: <strong>{Math.round(category.averageWPM)} PPM</strong>
                      </span>
                      <span>
                        Precisión: <strong>{Math.round(category.averageAccuracy)}%</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Intenta practicar con diferentes categorías de texto para ver esta estadística.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mejores puntuaciones */}
      <div className="card mb-8">
        <div className="card-body">
          <h2 className="text-xl font-bold mb-4">Mejores puntuaciones</h2>
          {stats.topScores && stats.topScores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Texto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PPM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precisión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topScores.map((score) => (
                    <tr key={score._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {score.text.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {score.text.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {Math.round(score.wpm)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {score.accuracy.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(score.date).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aún no tienes puntuaciones registradas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;