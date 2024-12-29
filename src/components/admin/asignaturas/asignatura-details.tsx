import {
  BookOpen,
  Users,
  School,
  Calendar,
  Loader2
} from 'lucide-react';
import type { Asignatura } from '../../../types/asignaturas';
import type { Seccion } from '../../../types/sections';

interface AsignaturaDetailsProps {
  asignatura: Asignatura | null;
  secciones: Seccion[];
  isLoading: boolean;
}

export function AsignaturaDetails({ asignatura, secciones, isLoading }: AsignaturaDetailsProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  if (!asignatura) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {asignatura.nombre}
        </h2>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span>{asignatura.codigo}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3 mb-1">
            <School className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Secciones
            </span>
          </div>
          <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            {secciones.length}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3 mb-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Alumnos Totales
            </span>
          </div>
          <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            {secciones.reduce((total, seccion) => total + (seccion.inscripciones?.length || 0), 0)}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Secciones Activas
        </h3>
        <div className="space-y-3">
          {secciones.map((seccion) => (
            <div
              key={seccion.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Periodo {seccion.periodo} - {seccion.ano}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Prof. {seccion.profesor?.nombre} {seccion.profesor?.apellido}
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {seccion.inscripciones?.length || 0} / {seccion.cupo_maximo} alumnos
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Información Adicional
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Creada el {new Date(asignatura.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}