import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Obtener todos los profesores
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('usuarios')
      .select('*')
      .eq('role', 'profesor');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener secciones de un profesor específico
router.get('/:id/secciones', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('secciones')
      .select(`
        *,
        asignatura:asignaturas (
          id,
          nombre,
          codigo
        ),
        inscripciones (
          id,
          alumno:usuarios (
            id,
            nombre,
            apellido
          )
        )
      `)
      .eq('profesor_id', req.params.id)
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una sección de un profesor
router.put('/:profesorId/secciones/:seccionId', async (req, res) => {
  try {
    const seccionSchema = z.object({
      periodo: z.string(),
      ano: z.number(),
      cupo_maximo: z.number(),
      activo: z.boolean().optional()
    });

    const updates = seccionSchema.parse(req.body);

    const { data, error } = await req.supabase
      .from('secciones')
      .update(updates)
      .eq('id', req.params.seccionId)
      .eq('profesor_id', req.params.profesorId)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Sección no encontrada' });
    }

    res.json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Desactivar una sección
router.delete('/:profesorId/secciones/:seccionId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('secciones')
      .update({ activo: false })
      .eq('id', req.params.seccionId)
      .eq('profesor_id', req.params.profesorId)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Sección no encontrada' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;