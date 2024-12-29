import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StudentLayout } from '../../components/layouts/student-layout';
import { StudentStats } from '../../components/alumno/stats-section';
import { EnrolledSections } from '../../components/alumno/enrolled-sections';
import { UpcomingEvaluations } from '../../components/alumno/upcoming-evaluations';
import { alumnosApi } from '../../services/api';
import type { Seccion } from '../../types/sections';

export function AlumnoDashboard() {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSecciones();
  }, []);

  const loadSecciones = async () => {
    try {
      const data = await alumnosApi.getMisSecciones();
      setSecciones(data);
    } catch (error) {
      toast.error('Error al cargar las secciones');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout title="Mi Panel">
      <div className="space-y-6 max-w-7xl mx-auto">
        <StudentStats secciones={secciones} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnrolledSections secciones={secciones} isLoading={isLoading} />
          </div>
          
          <div className="lg:col-span-1">
            <UpcomingEvaluations secciones={secciones} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}