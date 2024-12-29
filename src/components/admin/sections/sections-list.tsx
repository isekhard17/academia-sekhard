import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  LayoutGrid,
  Users,
  GraduationCap,
  Loader2,
  Calendar
} from 'lucide-react';
import type { Seccion } from '../../../types/sections';

interface SectionsListProps {
  secciones: Seccion[];
  isLoading: boolean;
  onCreateSection: () => void;
  onEditSection: (section: Seccion) => void;
}

export function SectionsList({
  secciones,
  isLoading,
  onCreateSection,
  onEditSection
}: SectionsListProps) {
  const [search, setSearch] = useState('');

  const filteredSecciones = secciones.filter(
    (seccion) =>
      seccion.asignatura.nombre.toLowerCase().includes(search.toLowerCase()) ||
      seccion.profesor.nombre.toLowerCase().includes(search.toLowerCase()) ||
      seccion.profesor.apellido.toLowerCase().includes(search.toLowerCase())
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
            <LayoutGrid className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Secciones
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestiona las secciones del sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar secciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={onCreateSection}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Sección
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSecciones.map((seccion) => (
          <motion.div
            key={seccion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {seccion.asignatura.nombre}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Periodo {seccion.periodo} - {seccion.ano}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>
                    Prof. {seccion.profesor.nombre} {seccion.profesor.apellido}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {seccion.inscripciones.length} / {seccion.cupo_maximo} alumnos
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <button
                  onClick={() => onEditSection(seccion)}
                  className="px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Editar Sección
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredSecciones.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron secciones
          </div>
        )}
      </div>
    </div>
  );
}