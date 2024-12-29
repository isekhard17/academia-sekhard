import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  GraduationCap,
  Loader2,
  ChevronRight
} from 'lucide-react';
import type { Usuario } from '../../../types/users';

interface TeachersListProps {
  teachers: Usuario[];
  isLoading: boolean;
  onViewDetails: (teacher: Usuario) => void;
}

export function TeachersList({ teachers, isLoading, onViewDetails }: TeachersListProps) {
  const [search, setSearch] = useState('');

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.nombre.toLowerCase().includes(search.toLowerCase()) ||
      teacher.apellido.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase())
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
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Profesores
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestiona el equipo docente
            </p>
          </div>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar profesores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                      {teacher.nombre[0]}
                      {teacher.apellido[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {teacher.nombre} {teacher.apellido}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {teacher.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Miembro desde: {new Date(teacher.created_at).toLocaleDateString()}
              </div>

              <button
                onClick={() => onViewDetails(teacher)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Ver detalles
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filteredTeachers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron profesores
          </div>
        )}
      </div>
    </div>
  );
}