import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, LayoutGrid } from 'lucide-react';
import { StatCard } from '../ui/stat-card';
import type { Stats } from '../../types/stats';

interface StatsSectionProps {
  stats: Stats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard
          title="Alumnos"
          value={stats?.totalAlumnos || 0}
          icon={Users}
          trend={10}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard
          title="Profesores"
          value={stats?.totalProfesores || 0}
          icon={GraduationCap}
          trend={5}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatCard
          title="Asignaturas"
          value={stats?.totalAsignaturas || 0}
          icon={BookOpen}
          trend={-2}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatCard
          title="Secciones Activas"
          value={stats?.totalSecciones || 0}
          icon={LayoutGrid}
          trend={8}
        />
      </motion.div>
    </div>
  );
}