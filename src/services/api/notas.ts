import { api } from '../../lib/axios';
import { env } from '../../config/env';
import type { Database } from '../../types/database';

type Nota = Database['public']['Tables']['notas']['Row'];
type NotaDetalle = Nota & {
  evaluacion: Database['public']['Tables']['evaluaciones']['Row'];
};

export const notasApi = {
  getByAlumnoAndSeccion: (alumnoId: string, seccionId: string) =>
    api.get<NotaDetalle[]>(
      `${env.api.endpoints.notas}/alumno/${alumnoId}/seccion/${seccionId}`
    ),

  create: (nota: Omit<Nota, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Nota>(env.api.endpoints.notas, nota),

  update: (id: string, nota: Partial<Nota>) =>
    api.put<Nota>(`${env.api.endpoints.notas}/${id}`, nota),
};