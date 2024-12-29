import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Unidad } from '../../types/units';

export const unidadesApi = {
  create: async (unidad: Omit<Unidad, 'id' | 'created_at' | 'updated_at' | 'materiales'>) => {
    try {
      const response = await api.post<Unidad>(
        `${env.api.endpoints.asignaturas}/${unidad.asignatura_id}/unidades`, 
        unidad
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
        console.error('Status:', error.response.status);
        throw new Error(error.response.data.message || 'Error del servidor');
      } else if (error.request) {
        console.error('Error de red:', error.request);
        throw new Error('Error de conexión con el servidor');
      } else {
        console.error('Error:', error.message);
        throw error;
      }
    }
  },

  getAll: (asignaturaId: string) =>
    api.get<Unidad[]>(`${env.api.endpoints.asignaturas}/${asignaturaId}/unidades`),

  getById: (id: string) =>
    api.get<Unidad>(`${env.api.endpoints.asignaturas}/unidades/${id}`),

  update: (id: string, unidad: Partial<Omit<Unidad, 'id' | 'created_at' | 'updated_at' | 'materiales'>>) =>
    api.put<Unidad>(`${env.api.endpoints.asignaturas}/${unidad.asignatura_id}/unidades/${id}`, unidad),

  delete: async (id: string) => {
    try {
      const response = await api.delete<void>(
        `${env.api.endpoints.asignaturas}/unidades/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
        throw new Error(error.response.data.message || 'Error al eliminar la unidad');
      }
      throw error;
    }
  }
};