import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react';
import type { Seccion } from '../../types/sections';

interface EnrolledSectionsProps {
  secciones: Seccion[];
  isLoading: boolean;
}

export function EnrolledSections({ secciones, isLoading }: EnrolledSectionsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Mis Asignaturas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Asignaturas inscritas este semestre
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {secciones.map((seccion) => (
            <motion.div
              key={seccion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => navigate(`/alumno/secciones/${seccion.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {seccion.asignatura.nombre}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Periodo {seccion.periodo} - {seccion.ano}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        Prof. {seccion.profesor.nombre} {seccion.profesor.apellido}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}

          {secciones.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No hay asignaturas inscritas
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No tienes asignaturas inscritas para este periodo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}