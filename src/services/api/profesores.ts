import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Usuario } from '../../types/users';
import type { Seccion } from '../../types/sections';

export const profesoresApi = {
  getAll: () =>
    api.get<Usuario[]>(env.api.endpoints.profesores),

  getById: (id: string) =>
    api.get<Usuario>(`${env.api.endpoints.profesores}/${id}`),

  getSecciones: (profesorId: string) =>
    api.get<Seccion[]>(`${env.api.endpoints.profesores}/${profesorId}/secciones`),

  updateSeccion: (profesorId: string, seccionId: string, updates: Partial<Seccion>) =>
    api.put<Seccion>(
      `${env.api.endpoints.profesores}/${profesorId}/secciones/${seccionId}`,
      updates
    ),

  deleteSeccion: (profesorId: string, seccionId: string) =>
    api.delete<Seccion>(
      `${env.api.endpoints.profesores}/${profesorId}/secciones/${seccionId}`
    ),
};