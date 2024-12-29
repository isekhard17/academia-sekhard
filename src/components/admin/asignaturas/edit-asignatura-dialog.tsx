import { useState } from 'react';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';
import { asignaturasApi } from '../../../services/api';
import type { Asignatura } from '../../../types/asignaturas';

interface EditAsignaturaDialogProps {
  asignatura: Asignatura | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditAsignaturaDialog({
  asignatura,
  onClose,
  onSuccess
}: EditAsignaturaDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!asignatura) return;
    
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      codigo: formData.get('codigo') as string,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string
    };

    try {
      await asignaturasApi.update(asignatura.id, updates);
      toast.success('Asignatura actualizada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al actualizar la asignatura');
    } finally {
      setIsLoading(false);
    }
  };

  if (!asignatura) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-md">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Editar Asignatura
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
            htmlFor="codigo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Código
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            defaultValue={asignatura.codigo}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            defaultValue={asignatura.nombre}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            defaultValue={asignatura.descripcion || ''}
            rows={3}
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
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}