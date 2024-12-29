import type { Database } from './database';

export type Asignatura = Database['public']['Tables']['asignaturas']['Row'];

export interface CreateAsignaturaData {
  codigo: string;
  nombre: string;
  descripcion: string;
}