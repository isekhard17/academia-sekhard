import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Asignatura } from '../../types/asignaturas';
import type { Unidad } from '../../types/units';
import type { Seccion } from '../../types/sections';


export const asignaturasApi = {
  getAll: () =>
    api.get<Asignatura[]>(env.api.endpoints.asignaturas),

  getById: (id: string) =>
    api.get<Asignatura>(`${env.api.endpoints.asignaturas}/${id}`),

  getSecciones: (asignaturaId: string) =>
    api.get<Seccion[]>(`${env.api.endpoints.secciones}/asignatura/${asignaturaId}`),

  getUnidades: (asignaturaId: string) =>
    api.get<Unidad[]>(`${env.api.endpoints.asignaturas}/${asignaturaId}/unidades`),

  create: (asignatura: Omit<Asignatura, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Asignatura>(env.api.endpoints.asignaturas, asignatura),

  update: (id: string, asignatura: Partial<Asignatura>) =>
    api.put<Asignatura>(`${env.api.endpoints.asignaturas}/${id}`, asignatura),

  checkExists: async (field: string, value: string): Promise<boolean> => {
    try {
      const { data } = await api.get<{ exists: boolean }>(
        `${env.api.endpoints.asignaturas}/validar`,
        {
          params: { field, value }
        }
      );
      return data.exists;
    } catch (error) {
      console.error('Error checking existence:', error);
      return false;
    }
  },
};