import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Usuario } from '../../types/users';


interface StatsResponse {
  total_alumnos: number;
  total_profesores: number;
  total_asignaturas: number;
  total_secciones: number;
}

export const adminApi = {
  getEstadisticas: async () => {
    try {
      const response = await api.get<StatsResponse>(env.api.endpoints.admin + '/estadisticas');
      console.log('Respuesta completa:', response);
      console.log('Datos de la respuesta:', response.data);
      
      return response; // Devolvemos la respuesta directamente
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      throw error;
    }
  },

  getDistribucionAlumnos: () =>
    api.get<Array<{ seccion: number; count: number }>>(
      env.api.endpoints.admin + '/distribucion-alumnos'
    ),

  getAsignaturasStats: () =>
    api.get<Array<{ nombre: string; promedio: number }>>(
      env.api.endpoints.admin + '/asignaturas-stats'
    ),

  // User management
  getUsuarios: async (role?: 'admin' | 'profesor' | 'alumno') => {
    const response = await api.get<Usuario[]>(env.api.endpoints.admin + '/usuarios', {
      params: { role }
    });
    return response.data;
  },

  getProfesores: () =>
    api.get<Usuario[]>(env.api.endpoints.admin + '/usuarios', {
      params: { role: 'profesor' }
    }),

  createUsuario: (usuario: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Usuario>(env.api.endpoints.admin + '/usuarios', usuario),

  updateUsuario: (id: string, updates: Partial<Usuario>) =>
    api.put<Usuario>(`${env.api.endpoints.admin}/usuarios/${id}`, updates)
};