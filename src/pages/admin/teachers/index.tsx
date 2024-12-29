import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../../components/layouts/dashboard-layout';
import { TeachersList } from '../../../components/admin/teachers/teachers-list';
import { TeacherDetailsDialog } from '../../../components/admin/teachers/teacher-details-dialog';
import { adminApi } from '../../../services/api';
import type { Usuario } from '../../../types/users';

export function TeachersPage() {
  const [teachers, setTeachers] = useState<Usuario[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await adminApi.getProfesores();
      setTeachers(data);
    } catch (error) {
      toast.error('Error al cargar los profesores');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        <TeachersList
          teachers={teachers}
          isLoading={isLoading}
          onViewDetails={setSelectedTeacher}
        />

        <TeacherDetailsDialog
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      </div>
    </DashboardLayout>
  );
}