import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Usuario } from '../types/users';

interface AuthContextType {
  user: Usuario | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Función para obtener los datos del usuario
  const fetchUser = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      
      setUser(data || null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          if (session?.user) {
            await fetchUser(session.user.id);
          } else {
            setIsLoading(false);
          }
        }

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (mounted) {
              setSession(session);
              if (session?.user) {
                await fetchUser(session.user.id);
              } else {
                setUser(null);
                setIsLoading(false);
              }
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userData) {
          setUser(userData);
          toast.success('¡Bienvenido!');
        } else {
          throw new Error('Usuario no encontrado');
        }
      }

    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Credenciales inválidas');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}