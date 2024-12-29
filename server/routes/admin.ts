import { Router } from 'express';
import { z } from 'zod';

const adminRouter = Router();

const usuarioSchema = z.object({
  email: z.string().email(),
  nombre: z.string(),
  apellido: z.string(),
  role: z.enum(['admin', 'profesor', 'alumno']),
  activo: z.boolean().default(true)
});

// Obtener todos los usuarios
adminRouter.get('/usuarios', async (req, res) => {
  try {
    const { role } = req.query;
    let query = req.supabase
      .from('usuarios')
      .select('*');
    
    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query.order('apellido');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear usuario
adminRouter.post('/usuarios', async (req, res) => {
  try {
    const usuario = usuarioSchema.parse(req.body);
    const { data, error } = await req.supabase
      .from('usuarios')
      .insert(usuario)
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

// Actualizar usuario
adminRouter.put('/usuarios/:id', async (req, res) => {
  try {
    const usuario = usuarioSchema.partial().parse(req.body);
    const { data, error } = await req.supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas generales del dashboard
adminRouter.get('/estadisticas', async (req, res) => {
  try {
    const [alumnos, profesores, asignaturas, secciones] = await Promise.all([
      req.supabase
        .from('usuarios')
        .select('id')
        .eq('role', 'alumno')
        .eq('activo', true),
      req.supabase
        .from('usuarios')
        .select('id')
        .eq('role', 'profesor')
        .eq('activo', true),
      req.supabase
        .from('asignaturas')
        .select('id'),
      req.supabase
        .from('secciones')
        .select('id')
    ]);

    // Verificar errores individuales
    if (alumnos.error) throw new Error(`Error en alumnos: ${alumnos.error.message}`);
    if (profesores.error) throw new Error(`Error en profesores: ${profesores.error.message}`);
    if (asignaturas.error) throw new Error(`Error en asignaturas: ${asignaturas.error.message}`);
    if (secciones.error) throw new Error(`Error en secciones: ${secciones.error.message}`);

    const stats = {
      total_alumnos: alumnos.data?.length || 0,
      total_profesores: profesores.data?.length || 0,
      total_asignaturas: asignaturas.data?.length || 0,
      total_secciones: secciones.data?.length || 0
    };

    console.log('Estadísticas calculadas:', stats);
    res.json(stats);

  } catch (error) {
    console.error('Error en /estadisticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      details: error.message 
    });
  }
});

// Distribución de alumnos por sección
adminRouter.get('/distribucion-alumnos', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('secciones')
      .select(`
        id,
        inscripciones (count)
      `)
      .eq('activo', true);

    if (error) throw error;

    const distribution = data.map((seccion, index) => ({
      seccion: index + 1,
      count: seccion.inscripciones[0].count
    }));

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas de asignaturas
adminRouter.get('/asignaturas-stats', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('asignaturas')
      .select(`
        nombre,
        secciones (
          evaluaciones (
            notas (nota)
          )
        )
      `);

    if (error) throw error;

    const stats = data.map(asignatura => {
      const notas = asignatura.secciones
        .flatMap(s => s.evaluaciones)
        .flatMap(e => e?.notas || [])
        .map(n => n.nota);

      const promedio = notas.length
        ? notas.reduce((a, b) => a + b, 0) / notas.length
        : 0;

      return {
        nombre: asignatura.nombre,
        promedio: Number(promedio.toFixed(1))
      };
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default adminRouter;