import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layouts/dashboard-layout';
import { StatsSection } from '../../components/admin/stats-section';
import { ChartsSection } from '../../components/admin/charts-section';
import { UpcomingEvaluations } from '../../components/admin/upcoming-evaluations';
import type { Stats } from '../../types/stats';

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalAlumnos: 0,
    totalProfesores: 0,
    totalAsignaturas: 0,
    totalSecciones: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getEstadisticas();
      console.log('Respuesta en dashboard:', response);
      
      // Si la respuesta viene directamente con los datos
      const statsData = response.data || response;
      
      setStats({
        totalAlumnos: statsData.total_alumnos || 0,
        totalProfesores: statsData.total_profesores || 0,
        totalAsignaturas: statsData.total_asignaturas || 0,
        totalSecciones: statsData.total_secciones || 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar las estadísticas');
      setStats({
        totalAlumnos: 0,
        totalProfesores: 0,
        totalAsignaturas: 0,
        totalSecciones: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        <StatsSection stats={stats} />
        <ChartsSection />
        <UpcomingEvaluations />
      </div>
    </DashboardLayout>
  );
}