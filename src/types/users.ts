export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: 'admin' | 'profesor' | 'alumno';
  activo: boolean;
  created_at: string;
  updated_at: string;
}