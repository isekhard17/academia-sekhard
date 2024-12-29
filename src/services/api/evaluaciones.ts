import { api } from '../../lib/axios';
import { env } from '../../config/env';

interface Evaluacion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_entrega: string;
  seccion_id: string;
  created_at: string;
  updated_at: string;
}

interface Nota {
  id: string;
  nota: number;
  alumno_id: string;
  evaluacion_id: string;
  created_at: string;
  updated_at: string;
  alumno: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: 'alumno';
  };
}

interface EvaluacionDetalle extends Evaluacion {
  notas: Nota[];
}

export const evaluacionesApi = {
  getBySeccion: (seccionId: string) =>
    api.get<EvaluacionDetalle[]>(
      `${env.api.endpoints.evaluaciones}/seccion/${seccionId}`
    ),

  create: (evaluacion: Omit<Evaluacion, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Evaluacion>(env.api.endpoints.evaluaciones, evaluacion),

  update: (id: string, evaluacion: Partial<Evaluacion>) =>
    api.put<Evaluacion>(`${env.api.endpoints.evaluaciones}/${id}`, evaluacion),

  getProximas: () =>
    api.get<EvaluacionDetalle[]>(`${env.api.endpoints.evaluaciones}/proximas`),
};