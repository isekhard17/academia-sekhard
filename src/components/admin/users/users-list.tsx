import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Pencil,
  CheckCircle,
  XCircle, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../../services/api';
import type { Usuario } from '../../../types/users';
import { DisableUserDialog } from './disable-user-dialog';
import { ModalContainer } from '../../ui/modal-container';

const ITEMS_PER_PAGE = 6;

interface UsersListProps {
  users: Usuario[];
  isLoading: boolean;
  onCreateUser: () => void;
  onEditUser: (user: Usuario) => void;
  onUserUpdated?: () => void;
}

export function UsersList({ users, isLoading, onCreateUser, onEditUser, onUserUpdated }: UsersListProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToToggle, setUserToToggle] = useState<Usuario | null>(null);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(search.toLowerCase()) ||
      user.apellido.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleToggleStatus = async (user: Usuario) => {
    setUserToToggle(user);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      await adminApi.updateUsuario(userToToggle.id, {
        activo: !userToToggle.activo
      });
      
      onUserUpdated?.();
      
      toast.success(
        userToToggle.activo 
          ? 'Usuario deshabilitado exitosamente' 
          : 'Usuario habilitado exitosamente'
      );
    } catch (error) {
      toast.error('Error al actualizar el estado del usuario');
    } finally {
      setUserToToggle(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Usuarios del Sistema
          </h3>
          
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={onCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors ml-auto"
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rol
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                        <span className="text-indigo-500 font-medium">
                          {user.nombre[0]}
                          {user.apellido[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.nombre} {user.apellido}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.activo ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">
                      <XCircle className="w-3 h-3" />
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`p-1 rounded-lg ${
                        user.activo
                          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                          : 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                      }`}
                      title={user.activo ? 'Deshabilitar usuario' : 'Habilitar usuario'}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                      title="Editar usuario"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <DisableUserDialog
          isOpen={!!userToToggle}
          onClose={() => setUserToToggle(null)}
          onConfirm={confirmToggleStatus}
          userName={userToToggle ? `${userToToggle.nombre} ${userToToggle.apellido}` : ''}
          isDisabling={!!userToToggle?.activo}
        />

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando{' '}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredUsers.length)}
                </span>{' '}
                a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
                </span>{' '}
                de{' '}
                <span className="font-medium">{filteredUsers.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <AnimatePresence>
        {userToToggle && (
          <ModalContainer
            onClose={() => setUserToToggle(null)}
            className="max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  userToToggle.activo 
                    ? 'bg-red-100 dark:bg-red-500/20' 
                    : 'bg-green-100 dark:bg-green-500/20'
                }`}>
                  <AlertOctagon className={`w-6 h-6 ${
                    userToToggle.activo 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {userToToggle.activo 
                      ? 'Deshabilitar usuario' 
                      : 'Habilitar usuario'
                    }
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {userToToggle.activo
                      ? '¿Estás seguro que deseas deshabilitar a este usuario? No podrá acceder al sistema hasta que sea habilitado nuevamente.'
                      : '¿Estás seguro que deseas habilitar a este usuario? Podrá acceder nuevamente al sistema.'
                    }
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserToToggle(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmToggleStatus}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    userToToggle.activo
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {userToToggle.activo ? 'Sí, deshabilitar' : 'Sí, habilitar'}
                </button>
              </div>
            </div>
          </ModalContainer>
        )}
      </AnimatePresence>
    </div>
  );
}