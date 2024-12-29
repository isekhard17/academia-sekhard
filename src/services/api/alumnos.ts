import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Seccion } from '../../types/sections';

export const alumnosApi = {
  getMisEstadisticas: () =>
    api.get<{
      promedioNotas: number;
      porcentajeAsistencia: number;
      evaluacionesPendientes: number;
    }>(env.api.endpoints.alumnos + '/mis-estadisticas'),

  getMisSecciones: () =>
    api.get<Seccion[]>(env.api.endpoints.alumnos + '/mis-secciones'),

  getMisNotas: (seccionId: string) =>
    api.get<any[]>(`${env.api.endpoints.alumnos}/mis-notas/seccion/${seccionId}`),

  getMiAsistencia: (seccionId: string) =>
    api.get<any[]>(`${env.api.endpoints.alumnos}/mi-asistencia/seccion/${seccionId}`)
};