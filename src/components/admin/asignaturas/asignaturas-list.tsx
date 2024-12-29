import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  BookOpen,
  ChevronRight,
  Loader2
} from 'lucide-react';
import type { Asignatura } from '../../../types/asignaturas';

interface AsignaturasListProps {
  asignaturas: Asignatura[];
  isLoading: boolean;
  onCreateAsignatura: () => void;
  onEditAsignatura: (asignatura: Asignatura) => void;
}

export function AsignaturasList({
  asignaturas,
  isLoading,
  onCreateAsignatura,
  onEditAsignatura
}: AsignaturasListProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredAsignaturas = asignaturas.filter(
    (asignatura) =>
      asignatura.nombre.toLowerCase().includes(search.toLowerCase()) ||
      asignatura.codigo.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Asignaturas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestiona las asignaturas del sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar asignaturas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={onCreateAsignatura}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Asignatura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAsignaturas.map((asignatura) => (
          <motion.div
            key={asignatura.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {asignatura.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Código: {asignatura.codigo}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {asignatura.descripcion || 'Sin descripción'}
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  onClick={() => onEditAsignatura(asignatura)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Editar
                </button>

                <button
                  onClick={() => navigate(`/admin/asignaturas/${asignatura.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Ver detalles
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAsignaturas.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron asignaturas
          </div>
        )}
      </div>
    </div>
  );
}