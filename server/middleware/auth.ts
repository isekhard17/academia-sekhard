import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/types/database';

// Tipos para extender Request
declare global {
  namespace Express {
    interface Request {
      user?: Database['public']['Tables']['usuarios']['Row'];
      supabase: ReturnType<typeof createClient<Database>>;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await req.supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Obtener datos del usuario desde nuestra tabla usuarios
    const { data: userData, error: userError } = await req.supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = userData;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar autenticación' });
  }
};

export const requireRoles = (roles: Array<'admin' | 'profesor' | 'alumno'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'No tiene permisos para realizar esta acción' 
      });
    }

    next();
  };
};