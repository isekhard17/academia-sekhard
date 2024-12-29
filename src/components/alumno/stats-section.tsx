import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Clock, Award } from 'lucide-react';
import { StatCard } from '../ui/stat-card';
import { alumnosApi } from '../../services/api';
import type { Seccion } from '../../types/sections';

interface StudentStatsProps {
  secciones: Seccion[];
  isLoading: boolean;
}

export function StudentStats({ secciones, isLoading }: StudentStatsProps) {
  const [stats, setStats] = useState({
    totalAsignaturas: 0,
    promedioAsistencia: 0,
    promedioNotas: 0,
    evaluacionesPendientes: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await alumnosApi.getMisEstadisticas();
        setStats({
          totalAsignaturas: secciones.length,
          promedioAsistencia: data.porcentajeAsistencia,
          promedioNotas: data.promedioNotas,
          evaluacionesPendientes: data.evaluacionesPendientes
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('Error al cargar las estadísticas');
      }
    };

    if (!isLoading) {
      loadStats();
    }
  }, [secciones, isLoading]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard
          title="Asignaturas"
          value={stats.totalAsignaturas}
          icon={BookOpen}
          trend={0}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard
          title="Promedio Notas"
          value={stats.promedioNotas}
          icon={Award}
          trend={5}
          decimals={1}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatCard
          title="Asistencia"
          value={stats.promedioAsistencia}
          icon={GraduationCap}
          trend={2}
          decimals={1}
          suffix="%"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatCard
          title="Evaluaciones Pendientes"
          value={stats.evaluacionesPendientes}
          icon={Clock}
          trend={0}
        />
      </motion.div>
    </div>
  );
}