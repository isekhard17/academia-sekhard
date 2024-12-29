import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Obtener estadísticas del alumno
router.get('/mis-estadisticas', async (req, res) => {
  try {
    const alumnoId = req.user!.id;

    // Obtener promedio de notas
    const { data: notas, error: notasError } = await req.supabase
      .from('notas')
      .select('nota')
      .eq('alumno_id', alumnoId);

    if (notasError) throw notasError;

    const promedioNotas = notas && notas.length > 0
      ? notas.reduce((sum, n) => sum + n.nota, 0) / notas.length
      : 0;

    // Obtener porcentaje de asistencia
    const { data: asistencias, error: asistenciasError } = await req.supabase
      .from('asistencias')
      .select('presente')
      .eq('alumno_id', alumnoId);

    if (asistenciasError) throw asistenciasError;

    const porcentajeAsistencia = asistencias && asistencias.length > 0
      ? (asistencias.filter(a => a.presente).length / asistencias.length) * 100
      : 0;

    // Obtener evaluaciones pendientes
    const { data: evaluaciones, error: evaluacionesError } = await req.supabase
      .from('evaluaciones')
      .select(`
        id,
        seccion_id,
        fecha_entrega
      `)
      .gt('fecha_entrega', new Date().toISOString())
      .order('fecha_entrega');

    if (evaluacionesError) throw evaluacionesError;

    res.json({
      promedioNotas,
      porcentajeAsistencia,
      evaluacionesPendientes: evaluaciones?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener mis secciones inscritas
router.get('/mis-secciones', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('secciones')
      .select(`
        id,
        asignatura: asignaturas (
          id,
          codigo,
          nombre
        ),
        profesor: usuarios!profesor_id (
          nombre,
          apellido
        ),
        periodo,
        ano
      `)
      .eq('inscripciones.alumno_id', req.user!.id)
      .eq('activo', true);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener mis notas en una sección
router.get('/mis-notas/seccion/:seccionId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('notas')
      .select(`
        id,
        nota,
        comentario,
        evaluacion: evaluaciones!evaluacion_id (
          nombre,
          tipo,
          ponderacion,
          fecha_entrega
        )
      `)
      .eq('alumno_id', req.user!.id)
      .eq('evaluacion.seccion_id', req.params.seccionId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener mi asistencia en una sección
router.get('/mi-asistencia/seccion/:seccionId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('asistencias')
      .select('*')
      .eq('alumno_id', req.user!.id)
      .eq('seccion_id', req.params.seccionId)
      .order('fecha');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;