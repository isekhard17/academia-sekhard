import { useState } from 'react';
import { X, Save, BookOpen, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ModalContainer } from '../../ui/modal-container';
import { profesoresApi } from '../../../services/api';
import type { Seccion } from '../../../types/sections';

interface EditSectionDialogProps {
  section: Seccion | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditSectionDialog({ section, onClose, onSuccess }: EditSectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!section) return;
    
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      periodo: formData.get('periodo') as string,
      ano: Number(formData.get('ano')),
      cupo_maximo: Number(formData.get('cupo_maximo'))
    };

    try {
      await profesoresApi.updateSeccion(section.profesor_id, section.id, updates);
      toast.success('Sección actualizada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al actualizar la sección');
    } finally {
      setIsLoading(false);
    }
  };

  if (!section) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-md">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Editar Sección
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              {section.asignatura?.nombre}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Periodo
              </label>
              <select
                name="periodo"
                defaultValue={section.periodo}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="1">Primer Periodo</option>
                <option value="2">Segundo Periodo</option>
                <option value="3">Tercer Periodo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Año
              </label>
              <input
                type="number"
                name="ano"
                defaultValue={section.ano}
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cupo Máximo
            </label>
            <input
              type="number"
              name="cupo_maximo"
              defaultValue={section.cupo_maximo}
              min={1}
              max={50}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">
                Consideraciones importantes
              </h4>
              <ul className="text-sm text-amber-600 dark:text-amber-400 mt-1 list-disc list-inside space-y-1">
                <li>El cupo máximo no puede ser menor al número de estudiantes inscritos</li>
                <li>Los cambios aplicarán inmediatamente</li>
                <li>Notifica a los estudiantes sobre cualquier cambio relevante</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
} 