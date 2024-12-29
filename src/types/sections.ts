

export interface Seccion {
  id: string;
  asignatura_id: string;
  profesor_id: string;
  periodo: string;
  ano: number;
  cupo_maximo: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
  asignatura?: {
    id: string;
    nombre: string;
    codigo: string;
  };
  profesor?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  inscripciones?: Array<{
    id: string;
    alumno?: {
      id: string;
      nombre: string;
      apellido: string;
    };
  }>;
}