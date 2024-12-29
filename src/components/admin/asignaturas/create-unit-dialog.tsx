import { useState } from 'react';
import { toast } from 'sonner';
import { X, Loader2, BookOpen, ListOrdered, FileText, Info, Lightbulb } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';
import { unidadesApi } from '../../../services/api';

interface CreateUnitDialogProps {
  open: boolean;
  asignaturaId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUnitDialog({
  open,
  asignaturaId,
  onClose,
  onSuccess
}: CreateUnitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!asignaturaId) {
      console.error('asignaturaId es inválido:', asignaturaId);
      toast.error('ID de asignatura no válido');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const unidad = {
        asignatura_id: asignaturaId,
        nombre: formData.get('nombre') as string,
        descripcion: formData.get('descripcion') as string,
        orden: Number(formData.get('orden'))
      };

     await unidadesApi.create(unidad); 
      toast.success('Unidad creada exitosamente');
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear la unidad';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-2xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Nueva Unidad
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crea una nueva unidad para organizar el contenido de tu asignatura
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
                ¿Qué es una unidad?
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Una unidad es un conjunto organizado de contenidos y materiales que conforman una parte específica de tu asignatura.
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
                required
                placeholder="ej: Introducción a la Programación"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                defaultValue={1}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              placeholder="Describe el contenido y objetivos de esta unidad..."
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">
                  Tips para crear una buena unidad
                </h4>
                <ul className="text-sm text-amber-600 dark:text-amber-400 mt-1 list-disc list-inside space-y-1">
                  <li>Usa nombres descriptivos y concisos</li>
                  <li>Organiza las unidades en orden lógico</li>
                  <li>Incluye una descripción clara de los objetivos</li>
                  <li>Considera el tiempo necesario para completar la unidad</li>
                </ul>
              </div>
            </div>
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
                'Crear Unidad'
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}