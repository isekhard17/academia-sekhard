import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';
import { adminApi } from '../../../services/api';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserDialog({ open, onClose, onSuccess }: CreateUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const usuario = {
      email: formData.get('email') as string,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      role: formData.get('role') as 'admin' | 'profesor' | 'alumno',
      activo: true,
    };

    try {
      await adminApi.createUsuario(usuario);
      toast.success('Usuario creado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al crear el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <ModalContainer onClose={onClose} className="max-w-md">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Crear Nuevo Usuario
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
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
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
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="apellido"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Rol
          </label>
          <select
            id="role"
            name="role"
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="alumno">Alumno</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Administrador</option>
          </select>
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
              'Crear Usuario'
            )}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}