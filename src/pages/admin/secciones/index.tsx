import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../../components/layouts/dashboard-layout';
import { SectionsList } from '../../../components/admin/sections/sections-list';
import { CreateSectionDialog } from '../../../components/admin/sections/create-section-dialog';
import { EditSectionDialog } from '../../../components/admin/sections/edit-section-dialog';
import { seccionesApi } from '../../../services/api';
import type { Seccion } from '../../../types/sections';

export function SeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Seccion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSecciones();
  }, []);

  const loadSecciones = async () => {
    try {
      const data = await seccionesApi.getAll();
      setSecciones(data);
    } catch (error) {
      toast.error('Error al cargar las secciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionCreated = () => {
    loadSecciones();
    setShowCreateDialog(false);
  };

  const handleSectionUpdated = () => {
    loadSecciones();
    setEditingSection(null);
  };

  return (
    <DashboardLayout title="Secciones">
      <div className="space-y-4 max-w-7xl mx-auto">
        <SectionsList
          secciones={secciones}
          isLoading={isLoading}
          onCreateSection={() => setShowCreateDialog(true)}
          onEditSection={setEditingSection}
        />

        <CreateSectionDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleSectionCreated}
        />

        <EditSectionDialog
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSuccess={handleSectionUpdated}
        />
      </div>
    </DashboardLayout>
  );
}