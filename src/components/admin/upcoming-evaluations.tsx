import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';

type Evaluacion = {
  id: string;
  nombre: string;
  tipo: 'exam' | 'assignment' | 'project';
  fecha_entrega: string;
  seccion: {
    asignatura: {
      nombre: string;
    };
  };
};

export function UpcomingEvaluations() {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);

  useEffect(() => {
    // Suscripción a cambios en evaluaciones
    const channel = supabase
      .channel('evaluaciones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evaluaciones'
        },
        (payload) => {
          console.log('Cambio en evaluaciones:', payload);
          loadEvaluaciones();
        }
      )
      .subscribe();

    loadEvaluaciones();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadEvaluaciones = async () => {
    const { data } = await supabase
      .from('evaluaciones')
      .select(`
        *,
        seccion:secciones (
          asignatura:asignaturas (
            nombre
          )
        )
      `)
      .gte('fecha_entrega', new Date().toISOString())
      .order('fecha_entrega')
      .limit(5);

    if (data) {
      setEvaluaciones(data as Evaluacion[]);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
          Próximas Evaluaciones
        </h3>
      </div>

      <div className="space-y-2.5">
        {evaluaciones.map((evaluacion, index) => (
          <motion.div
            key={evaluacion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {evaluacion.nombre}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {evaluacion.seccion.asignatura.nombre}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(evaluacion.fecha_entrega), "d 'de' MMM 'a las' HH:mm", {
                    locale: es
                  })}
                </p>
              </div>
            </div>

            <span className={`
              px-2 py-0.5 text-xs font-medium rounded-full
              ${evaluacion.tipo === 'exam'
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                : evaluacion.tipo === 'assignment'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
              }
            `}>
              {evaluacion.tipo === 'exam' ? 'Examen'
                : evaluacion.tipo === 'assignment' ? 'Tarea'
                : 'Proyecto'
              }
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}