import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Database } from '../../types/database';

type Asistencia = Database['public']['Tables']['asistencias']['Row'];
type AsistenciaDetalle = Asistencia & {
  alumno: Database['public']['Tables']['usuarios']['Row'];
};

export const asistenciasApi = {
  getBySeccionAndFecha: (seccionId: string, fecha: string) =>
    api.get<AsistenciaDetalle[]>(
      `${env.api.endpoints.asistencias}/seccion/${seccionId}/fecha/${fecha}`
    ),

  getByAlumnoAndSeccion: (alumnoId: string, seccionId: string) =>
    api.get<Asistencia[]>(
      `${env.api.endpoints.asistencias}/alumno/${alumnoId}/seccion/${seccionId}`
    ),

  create: (asistencia: Omit<Asistencia, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Asistencia>(env.api.endpoints.asistencias, asistencia),

  update: (id: string, asistencia: Partial<Asistencia>) =>
    api.put<Asistencia>(`${env.api.endpoints.asistencias}/${id}`, asistencia),
};