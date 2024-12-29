import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const asistenciaSchema = z.object({
  seccion_id: z.string().uuid(),
  alumno_id: z.string().uuid(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  presente: z.boolean().default(false),
  registrado_por: z.string().uuid()
});

// Obtener asistencia de una sección por fecha
router.get('/seccion/:seccionId/fecha/:fecha', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('asistencias')
      .select(`
        *,
        alumno: usuarios!alumno_id (
          nombre,
          apellido
        )
      `)
      .eq('seccion_id', req.params.seccionId)
      .eq('fecha', req.params.fecha)
      .order('alumno(apellido)');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener asistencia de un alumno en una sección
router.get('/alumno/:alumnoId/seccion/:seccionId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('asistencias')
      .select('*')
      .eq('seccion_id', req.params.seccionId)
      .eq('alumno_id', req.params.alumnoId)
      .order('fecha');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar asistencia
router.post('/', async (req, res) => {
  try {
    const asistencia = asistenciaSchema.parse(req.body);
    
    // Verificar si ya existe un registro para esta fecha
    const { data: existing } = await req.supabase
      .from('asistencias')
      .select('id')
      .eq('seccion_id', asistencia.seccion_id)
      .eq('alumno_id', asistencia.alumno_id)
      .eq('fecha', asistencia.fecha)
      .single();

    if (existing) {
      return res.status(400).json({ 
        error: 'Ya existe un registro de asistencia para esta fecha' 
      });
    }

    const { data, error } = await req.supabase
      .from('asistencias')
      .insert(asistencia)
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

// Actualizar asistencia
router.put('/:id', async (req, res) => {
  try {
    const asistencia = asistenciaSchema.partial().parse(req.body);
    const { data, error } = await req.supabase
      .from('asistencias')
      .update(asistencia)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
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