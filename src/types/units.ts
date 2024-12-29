import type { Database } from './database';

export type Unidad = Database['public']['Tables']['unidades']['Row'] & {
  materiales: Array<Database['public']['Tables']['materiales']['Row']>;
};