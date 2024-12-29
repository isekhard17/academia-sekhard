import { useState, useEffect } from 'react';
import { X, Plus, BookOpen, Calendar, Users, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { ModalContainer } from '../../ui/modal-container';
import { asignaturasApi, seccionesApi } from '../../../services/api';
import type { Asignatura } from '../../../types/asignaturas';

interface AssignSectionDialogProps {
  isOpen: boolean;
  teacherId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignSectionDialog({
  isOpen,
  teacherId,
  onClose,
  onSuccess
}: AssignSectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

  useEffect(() => {
    loadAsignaturas();
  }, []);

  const loadAsignaturas = async () => {
    try {
      const response = await asignaturasApi.getAll();
      setAsignaturas(response.data);
    } catch (error) {
      toast.error('Error al cargar las asignaturas');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      asignatura_id: formData.get('asignatura_id') as string,
      profesor_id: teacherId,
      periodo: formData.get('periodo') as string,
      ano: Number(formData.get('ano')),
      cupo_maximo: Number(formData.get('cupo_maximo')),
      activo: true
    };

    try {
      await seccionesApi.create(data);
      toast.success('Sección asignada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al asignar la sección');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-md">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Asignar Nueva Sección
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                Asignatura
              </div>
            </label>
            <select
              name="asignatura_id"
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una asignatura</option>
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre} ({asignatura.codigo})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Periodo
                </div>
              </label>
              <select
                name="periodo"
                required
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
                required
                defaultValue={new Date().getFullYear()}
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                Cupo Máximo
              </div>
            </label>
            <input
              type="number"
              name="cupo_maximo"
              required
              min={1}
              max={50}
              defaultValue={30}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">
                Tips para crear una sección
              </h4>
              <ul className="text-sm text-blue-600 dark:text-blue-400 mt-1 list-disc list-inside space-y-1">
                <li>Verifica la disponibilidad del profesor</li>
                <li>Considera el tamaño del aula al definir el cupo</li>
                <li>Revisa el periodo académico seleccionado</li>
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
                Asignando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Asignar Sección
              </>
            )}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}