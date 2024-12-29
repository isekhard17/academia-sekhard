import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Seccion } from '../../types/sections';

export const seccionesApi = {
  getAll: () =>
    api.get<Seccion[]>(env.api.endpoints.secciones),

  getByAsignatura: (asignaturaId: string) =>
    api.get<Seccion[]>(`${env.api.endpoints.secciones}/asignatura/${asignaturaId}`),

  create: (seccion: Omit<Seccion, 'id' | 'created_at' | 'updated_at' | 'asignatura' | 'profesor' | 'inscripciones'>) =>
    api.post<Seccion>(env.api.endpoints.secciones, seccion),

  update: (id: string, seccion: Partial<Omit<Seccion, 'id' | 'created_at' | 'updated_at' | 'asignatura' | 'profesor' | 'inscripciones'>>) =>
    api.put<Seccion>(`${env.api.endpoints.secciones}/${id}`, seccion),
};