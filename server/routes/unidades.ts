import express from 'express';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = express.Router();

router.post('/:asignaturaId/unidades', requireAuth, requireRoles(['admin', 'profesor']), async (req, res) => {
  try {
    const { asignaturaId } = req.params;
    const { nombre, descripcion, orden } = req.body;

    const { data: unidad, error } = await req.supabase
      .from('unidades')
      .insert([
        {
          asignatura_id: asignaturaId,
          nombre,
          descripcion,
          orden
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(unidad);
  } catch (error) {
    console.error('Error al crear unidad:', error);
    res.status(500).json({ message: 'Error al crear la unidad' });
  }
});

export default router;