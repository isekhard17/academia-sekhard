import { Router } from 'express';
import { z } from 'zod';

const evaluacionesRouter = Router();

const evaluacionSchema = z.object({
  seccion_id: z.string().uuid(),
  unidad_id: z.string().uuid(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  tipo: z.string(),
  ponderacion: z.number().min(0).max(100),
  fecha_entrega: z.string().datetime()
});

// Obtener evaluaciones de una sección
evaluacionesRouter.get('/seccion/:seccionId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('evaluaciones')
      .select(`
        *,
        notas (
          id,
          nota,
          alumno: usuarios!alumno_id (nombre, apellido)
        )
      `)
      .eq('seccion_id', req.params.seccionId)
      .order('fecha_entrega');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una evaluación
evaluacionesRouter.post('/', async (req, res) => {
  try {
    const evaluacion = evaluacionSchema.parse(req.body);
    const { data, error } = await req.supabase
      .from('evaluaciones')
      .insert(evaluacion)
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

// Actualizar una evaluación
evaluacionesRouter.put('/:id', async (req, res) => {
  try {
    const evaluacion = evaluacionSchema.partial().parse(req.body);
    const { data, error } = await req.supabase
      .from('evaluaciones')
      .update(evaluacion)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }
    res.json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Obtener próximas evaluaciones
evaluacionesRouter.get('/proximas', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('evaluaciones')
      .select(`
        *,
        seccion:secciones (
          asignatura:asignaturas (nombre),
          profesor:usuarios!profesor_id (nombre, apellido)
        ),
        notas (
          id,
          nota,
          alumno:usuarios!alumno_id (nombre, apellido)
        )
      `)
      .gte('fecha_entrega', new Date().toISOString())
      .order('fecha_entrega')
      .limit(5);

    if (error) throw error;
    
    // Transformar los datos al formato esperado
    const evaluaciones = data.map(ev => ({
      id: ev.id,
      titulo: ev.nombre,
      fecha: ev.fecha_entrega,
      tipo: ev.tipo,
      asignatura: ev.seccion.asignatura.nombre,
      profesor: `${ev.seccion.profesor.nombre} ${ev.seccion.profesor.apellido}`
    }));

    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default evaluacionesRouter;