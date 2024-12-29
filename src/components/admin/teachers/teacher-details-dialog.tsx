import { useState, useEffect } from 'react';
import { X, Plus, BookOpen, Users, Pencil, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ModalContainer } from '../../ui/modal-container';
import { AssignSectionDialog } from './assign-section-dialog';
import { profesoresApi } from '../../../services/api';
import type { Usuario } from '../../../types/users';
import type { Seccion } from '../../../types/sections';
import { EditSectionDialog } from './edit-section-dialog';

interface TeacherDetailsDialogProps {
  teacher: Usuario | null;
  onClose: () => void;
}

export function TeacherDetailsDialog({ teacher, onClose }: TeacherDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Seccion | null>(null);

  useEffect(() => {
    if (teacher) {
      loadSecciones();
    }
  }, [teacher]);

  const loadSecciones = async () => {
    if (!teacher) return;
    
    try {
      setIsLoading(true);
      console.log('Intentando cargar secciones para profesor:', teacher.id);
      const response = await profesoresApi.getSecciones(teacher.id);
      console.log('Secciones obtenidas:', response);
      setSecciones(response.data);
    } catch (error) {
      console.error('Error detallado:', error);
      toast.error('Error al cargar las secciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionAssigned = () => {
    loadSecciones();
    setShowAssignDialog(false);
  };

  const handleDeleteSeccion = async (seccionId: string) => {
    if (!teacher) return;
    
    try {
      await profesoresApi.deleteSeccion(teacher.id, seccionId);
      toast.success('Sección eliminada exitosamente');
      loadSecciones();
    } catch (error) {
      toast.error('Error al eliminar la sección');
    }
  };

  if (!teacher) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-2xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Detalles del Profesor
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {teacher && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <span className="text-xl font-medium text-indigo-600 dark:text-indigo-400">
                  {teacher.nombre[0]}
                  {teacher.apellido[0]}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {teacher.nombre} {teacher.apellido}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {teacher.email}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Secciones Asignadas
                  </h4>
                </div>
                <button
                  onClick={() => setShowAssignDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Asignar Sección
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : secciones.length > 0 ? (
                <div className="space-y-3">
                  {secciones.map((seccion) => (
                    <div
                      key={seccion.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {seccion.asignatura?.nombre}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Periodo {seccion.periodo} - {seccion.ano}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            {seccion.inscripciones?.length || 0}/{seccion.cupo_maximo}
                          </div>
                          <button
                            onClick={() => setEditingSection(seccion)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSeccion(seccion.id)}
                            className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Este profesor no tiene secciones asignadas
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showAssignDialog && (
        <AssignSectionDialog
          isOpen={showAssignDialog}
          teacherId={teacher?.id || ''}
          onClose={() => setShowAssignDialog(false)}
          onSuccess={handleSectionAssigned}
        />
      )}

      <EditSectionDialog
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSuccess={() => {
          setEditingSection(null);
          loadSecciones();
        }}
      />
    </ModalContainer>
  );
}