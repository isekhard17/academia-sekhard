import { Router } from 'express';
import { z } from 'zod';

const notasRouter = Router();

const notaSchema = z.object({
  evaluacion_id: z.string().uuid(),
  alumno_id: z.string().uuid(),
  nota: z.number().min(1.0).max(7.0),
  comentario: z.string().optional(),
  registrado_por: z.string().uuid()
});

// Obtener notas de un alumno en una sección
notasRouter.get('/alumno/:alumnoId/seccion/:seccionId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('notas')
      .select(`
        *,
        evaluacion: evaluaciones!evaluacion_id (
          nombre,
          tipo,
          ponderacion
        )
      `)
      .eq('alumno_id', req.params.alumnoId)
      .eq('evaluacion.seccion_id', req.params.seccionId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar una nota
notasRouter.post('/', async (req, res) => {
  try {
    const nota = notaSchema.parse(req.body);
    const { data, error } = await req.supabase
      .from('notas')
      .insert(nota)
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

// Actualizar una nota
notasRouter.put('/:id', async (req, res) => {
  try {
    const nota = notaSchema.partial().parse(req.body);
    const { data, error } = await req.supabase
      .from('notas')
      .update(nota)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

export default notasRouter;