import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';
import { seccionesApi, asignaturasApi, profesoresApi } from '../../../services/api';
import type { Asignatura } from '../../../types/asignaturas';
import type { Usuario } from '../../../types/users';

interface CreateSectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSectionDialog({
  open,
  onClose,
  onSuccess
}: CreateSectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [profesores, setProfesores] = useState<Usuario[]>([]);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [asignaturasData, profesoresData] = await Promise.all([
        asignaturasApi.getAll(),
        profesoresApi.getAll()
      ]);
      setAsignaturas(asignaturasData);
      setProfesores(profesoresData);
    } catch (error) {
      toast.error('Error al cargar los datos');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const seccion = {
      asignatura_id: formData.get('asignatura_id') as string,
      profesor_id: formData.get('profesor_id') as string,
      periodo: formData.get('periodo') as string,
      ano: Number(formData.get('ano')),
      cupo_maximo: Number(formData.get('cupo_maximo')),
      activo: true
    };

    try {
      await seccionesApi.create(seccion);
      toast.success('Sección creada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al crear la sección');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-md">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Nueva Sección
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label
            htmlFor="asignatura_id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Asignatura
          </label>
          <select
            id="asignatura_id"
            name="asignatura_id"
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Seleccionar asignatura...</option>
            {asignaturas.map((asignatura) => (
              <option key={asignatura.id} value={asignatura.id}>
                {asignatura.nombre} ({asignatura.codigo})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="profesor_id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Profesor
          </label>
          <select
            id="profesor_id"
            name="profesor_id"
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Seleccionar profesor...</option>
            {profesores.map((profesor) => (
              <option key={profesor.id} value={profesor.id}>
                {profesor.nombre} {profesor.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="periodo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Periodo
          </label>
          <select
            id="periodo"
            name="periodo"
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="1">Primer Semestre</option>
            <option value="2">Segundo Semestre</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ano"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Año
          </label>
          <input
            type="number"
            id="ano"
            name="ano"
            min={2024}
            max={2030}
            required
            defaultValue={new Date().getFullYear()}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="cupo_maximo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Cupo Máximo
          </label>
          <input
            type="number"
            id="cupo_maximo"
            name="cupo_maximo"
            min={1}
            max={50}
            required
            defaultValue={30}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Sección'
            )}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}