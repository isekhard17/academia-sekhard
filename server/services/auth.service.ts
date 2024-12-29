import { supabase } from '../config/supabase';
import type { Database } from '../../src/types/database';

type Usuario = Database['public']['Tables']['usuarios']['Row'];

export const authService = {
  async signIn(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Obtener datos del usuario de nuestra tabla personalizada
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    return {
      session: authData.session,
      user: userData,
    };
  },

  async validateToken(token: string) {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Token inválido');
    }

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    return userData;
  }
};