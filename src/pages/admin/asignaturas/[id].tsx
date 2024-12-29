import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../../../components/layouts/dashboard-layout';
import { AsignaturaDetails } from '../../../components/admin/asignaturas/asignatura-details';
import { UnitsManagement } from '../../../components/admin/asignaturas/units-management';
import { asignaturasApi } from '../../../services/api';
import type { Asignatura } from '../../../types/asignaturas';
import type { Seccion } from '../../../types/sections';
import type { Unidad } from '../../../types/units';

export function AsignaturaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (asignaturaId: string) => {
    try {
      setIsLoading(true);
      const [asignaturaData, seccionesData, unidadesData] = await Promise.all([
        asignaturasApi.getById(asignaturaId),
        asignaturasApi.getSecciones(asignaturaId),
        asignaturasApi.getUnidades(asignaturaId)
      ]);

      setAsignatura(asignaturaData.data);
      setSecciones(seccionesData.data);
      setUnidades(unidadesData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
      navigate('/admin/asignaturas');
    } finally {
      setIsLoading(false);
    }
  };

  if (!id) {
    return <div>Error: ID de asignatura no encontrado</div>;
  }

  return (
    <DashboardLayout title={asignatura?.nombre || 'Detalles de Asignatura'}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AsignaturaDetails
              asignatura={asignatura}
              secciones={secciones}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-2">
            <UnitsManagement
              unidades={unidades}
              isLoading={isLoading}
              onUnitCreated={() => loadData(id)}
              onUnitUpdated={() => loadData(id)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}