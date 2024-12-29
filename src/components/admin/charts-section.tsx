import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import { doughnutOptions, barOptions } from '../../utils/chart-configs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  distributionData: Array<{ seccion: number; count: number }>;
  asignaturasData: Array<{ nombre: string; promedio: number }>;
}

export function ChartsSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChartData>({
    distributionData: [],
    asignaturasData: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [distribution, asignaturas] = await Promise.all([
        adminApi.getDistribucionAlumnos(),
        adminApi.getAsignaturasStats()
      ]);

      setData({
        distributionData: distribution,
        asignaturasData: asignaturas
      });
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError('Error al cargar los datos estadísticos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-[400px] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const doughnutData = {
    labels: data.distributionData.map(d => `Sección ${d.seccion}`),
    datasets: [{
      data: data.distributionData.map(d => d.count),
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',
        'rgba(124, 58, 237, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const barData = {
    labels: data.asignaturasData.map(a => a.nombre),
    datasets: [{
      data: data.asignaturasData.map(a => a.promedio),
      backgroundColor: 'rgba(79, 70, 229, 0.8)',
      borderRadius: 4,
      borderSkipped: false,
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Distribución de Alumnos por Sección
        </h3>
        <div className="relative aspect-square w-full max-w-[300px] mx-auto">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Promedio por Asignatura
        </h3>
        <div className="relative h-[300px]">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}