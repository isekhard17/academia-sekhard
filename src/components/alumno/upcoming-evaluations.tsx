import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import type { Seccion } from '../../types/sections';

interface UpcomingEvaluationsProps {
  secciones: Seccion[];
  isLoading: boolean;
}

export function UpcomingEvaluations({ secciones, isLoading }: UpcomingEvaluationsProps) {
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]); // TODO: Add proper type

  useEffect(() => {
    // TODO: Load evaluaciones from API
  }, [secciones]);

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
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Próximas Evaluaciones
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Evaluaciones pendientes
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {evaluaciones.length > 0 ? (
            evaluaciones.map((evaluacion) => (
              <motion.div
                key={evaluacion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {evaluacion.nombre}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {evaluacion.asignatura}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(new Date(evaluacion.fecha), "d 'de' MMMM 'a las' HH:mm", {
                          locale: es
                        })}
                      </span>
                    </div>
                  </div>

                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${evaluacion.tipo === 'exam'
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      : evaluacion.tipo === 'assignment'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    }
                  `}>
                    {evaluacion.tipo === 'exam' ? 'Examen'
                      : evaluacion.tipo === 'assignment' ? 'Tarea'
                      : 'Proyecto'
                    }
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No hay evaluaciones pendientes
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No tienes evaluaciones programadas próximamente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}