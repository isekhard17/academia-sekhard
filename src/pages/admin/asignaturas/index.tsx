import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../../components/layouts/dashboard-layout';
import { AsignaturasList } from '../../../components/admin/asignaturas/asignaturas-list';
import { CreateAsignaturaDialog } from '../../../components/admin/asignaturas/create-asignatura-dialog';
import { EditAsignaturaDialog } from '../../../components/admin/asignaturas/edit-asignatura-dialog';
import { asignaturasApi } from '../../../services/api';
import type { Asignatura } from '../../../types/asignaturas';

export function AsignaturasPage() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAsignaturas();
  }, []);

  const loadAsignaturas = async () => {
    try {
      const data = await asignaturasApi.getAll();
      setAsignaturas(data);
    } catch (error) {
      toast.error('Error al cargar las asignaturas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsignaturaCreated = () => {
    loadAsignaturas();
    setShowCreateDialog(false);
  };

  const handleAsignaturaUpdated = () => {
    loadAsignaturas();
    setEditingAsignatura(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        <AsignaturasList
          asignaturas={asignaturas}
          isLoading={isLoading}
          onCreateAsignatura={() => setShowCreateDialog(true)}
          onEditAsignatura={setEditingAsignatura}
        />

        <CreateAsignaturaDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleAsignaturaCreated}
        />

        <EditAsignaturaDialog
          asignatura={editingAsignatura}
          onClose={() => setEditingAsignatura(null)}
          onSuccess={handleAsignaturaUpdated}
        />
      </div>
    </DashboardLayout>
  );
}