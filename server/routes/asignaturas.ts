import { Router } from 'express';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../src/types/database';
import type { Request, Response } from 'express';

const router = Router();

const asignaturaSchema = z.object({
  codigo: z.string()
    .min(6, 'El código debe tener al menos 6 caracteres')
    .regex(/^[A-Z]{2}\d{4}$/, 'El código debe tener formato: 2 letras seguidas de 4 números'),
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder los 500 caracteres')
});

// Exportar la función de validación separadamente
export const validateDuplicate = async (req: Request, res: Response) => {
  try {
    const { field, value } = req.query;
    
    if (!field || !value || !['codigo', 'nombre'].includes(field as string)) {
      return res.status(400).json({ error: 'Parámetros inválidos' });
    }

    const { data, error } = await req.supabase
      .from('asignaturas')
      .select('id')
      .ilike(field as string, value as string)
      .limit(1);

    if (error) throw error;

    return res.json({ exists: data && data.length > 0 });
  } catch (error) {
    console.error('Error validating field:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

// Obtener todas las asignaturas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('asignaturas')
      .select('*')
      .order('codigo');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una asignatura por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('asignaturas')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener unidades de una asignatura
router.get('/:id/unidades', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('unidades')
      .select(`
        *,
        materiales (*)
      `)
      .eq('asignatura_id', req.params.id)
      .order('orden');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva asignatura
router.post('/', async (req, res) => {
  try {
    const asignatura = asignaturaSchema.parse(req.body);
    
    // Supabase manejará automáticamente created_at y updated_at
    const { data, error } = await req.supabase
      .from('asignaturas')
      .insert(asignatura)
      .select()
      .single();

    if (error) {
      // Si es un error de duplicado
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Ya existe una asignatura con este código o nombre' 
        });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
});

// Actualizar una asignatura
router.put('/:id', async (req, res) => {
  try {
    const asignatura = asignaturaSchema.partial().parse(req.body);
    const { data, error } = await req.supabase
      .from('asignaturas')
      .update(asignatura)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Crear una unidad para una asignatura
router.post('/:id/unidades', async (req, res) => {
  try {
    const { id } = req.params;
    const unidad = {
      ...req.body,
      asignatura_id: id
    };
    
    const { data, error } = await req.supabase
      .from('unidades')
      .insert(unidad)
      .select()
      .single();

    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
});

// Actualizar una unidad
router.put('/:asignaturaId/unidades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const unidad = req.body;
    
    const { data, error } = await req.supabase
      .from('unidades')
      .update(unidad)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Unidad no encontrada' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
});

// Eliminar una unidad
router.delete('/unidades/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('unidades')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Unidad eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al eliminar la unidad' 
    });
  }
});

// Exportar el router como default
export default router;