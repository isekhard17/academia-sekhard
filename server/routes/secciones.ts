import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const seccionSchema = z.object({
  asignatura_id: z.string().uuid(),
  profesor_id: z.string().uuid(),
  periodo: z.string(),
  ano: z.number().int().min(2024),
  cupo_maximo: z.number().int().min(1).default(30),
  activo: z.boolean().default(true)
});

// Obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('secciones')
      .select(`
        *,
        asignatura:asignaturas (
          id,
          codigo,
          nombre
        ),
        profesor:usuarios!profesor_id (
          id,
          nombre,
          apellido
        ),
        inscripciones (
          id,
          alumno:usuarios!alumno_id (
            id,
            nombre,
            apellido
          )
        )
      `)
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener secciones por asignatura
router.get('/asignatura/:asignaturaId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('secciones')
      .select(`
        *,
        profesor:usuarios!profesor_id (
          id,
          nombre,
          apellido
        ),
        inscripciones (
          id,
          alumno:usuarios!alumno_id (
            id,
            nombre,
            apellido
          )
        )
      `)
      .eq('asignatura_id', req.params.asignaturaId)
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva sección
router.post('/', async (req, res) => {
  try {
    const seccion = seccionSchema.parse(req.body);
    const { data, error } = await req.supabase
      .from('secciones')
      .insert(seccion)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una sección
router.put('/:id', async (req, res) => {
  try {
    const seccion = seccionSchema.partial().parse(req.body);
    const { data, error } = await req.supabase
      .from('secciones')
      .update(seccion)
      .eq('id', req.params.id)
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

export default router;