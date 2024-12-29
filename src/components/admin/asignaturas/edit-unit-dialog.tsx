import { useState } from 'react';
import { toast } from 'sonner';
import { X, Loader2, BookOpen, ListOrdered, FileText, Info, Lightbulb, PencilLine, Trash2 } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';
import { unidadesApi } from '../../../services/api';
import type { Unidad } from '../../../types/units';

interface EditUnitDialogProps {
  unit: Unidad | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUnitDialog({
  unit,
  onClose,
  onSuccess
}: EditUnitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!unit) return;
    
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      asignatura_id: unit.asignatura_id,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      orden: Number(formData.get('orden'))
    };

    try {
      await unidadesApi.update(unit.id, updates);
      toast.success('Unidad actualizada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al actualizar la unidad');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!unit) return;
    
    setIsLoading(true);
    try {
      await unidadesApi.delete(unit.id);
      toast.success('Unidad eliminada exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Error al eliminar la unidad');
    } finally {
      setIsLoading(false);
    }
  };

  if (!unit) return null;

  if (showDeleteConfirm) {
    return (
      <ModalContainer onClose={() => setShowDeleteConfirm(false)} className="max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirmar eliminación
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-red-600 dark:text-red-400">
              ¿Estás seguro que deseas eliminar la unidad "{unit.nombre}"? Se perderán todos los materiales asociados.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Unidad'
              )}
            </button>
          </div>
        </div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer onClose={onClose} className="max-w-2xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
            <PencilLine className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Editar Unidad
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Modifica la información de la unidad
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">
                Editando: {unit.nombre}
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Actualiza la información de esta unidad manteniendo la coherencia con el resto del contenido.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  Nombre de la Unidad
                </div>
              </label>
              <input
                type="text"
                name="nombre"
                defaultValue={unit.nombre}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <ListOrdered className="w-4 h-4 text-gray-500" />
                  Orden
                </div>
              </label>
              <input
                type="number"
                name="orden"
                min={1}
                required
                defaultValue={unit.orden}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Descripción
              </div>
            </label>
            <textarea
              name="descripcion"
              rows={3}
              defaultValue={unit.descripcion || ''}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">
                  Consideraciones al editar
                </h4>
                <ul className="text-sm text-amber-600 dark:text-amber-400 mt-1 list-disc list-inside space-y-1">
                  <li>Mantén la coherencia con otras unidades</li>
                  <li>Verifica que el orden sea el correcto</li>
                  <li>Asegúrate de que la descripción sea clara</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Unidad
            </button>
            
            <div className="flex gap-3">
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
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}