import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// Simplificamos la ruta ya que el prefijo /api/validations ya está en index.ts
router.get('/asignaturas/check-duplicate', async (req: Request, res: Response) => {
  try {
    const { field, value } = req.query;
    

    // Validación de parámetros
    if (!field || !value || typeof field !== 'string' || typeof value !== 'string') {
      return res.status(400).json({
        isValid: false,
        message: 'Parámetros inválidos'
      });
    }

    // Validación del campo
    if (!['codigo', 'nombre'].includes(field)) {
      return res.status(400).json({
        isValid: false,
        message: 'Campo de validación inválido'
      });
    }

    // Consulta a Supabase
    const { data, error } = await req.supabase
      .from('asignaturas')
      .select('id')
      .eq(field, value)
      .maybeSingle();


    if (error) {
      console.error('❌ Error Supabase:', error);
      return res.status(500).json({
        isValid: false,
        message: 'Error al verificar duplicados'
      });
    }

    // Siempre devolvemos una respuesta estructurada
    const response = {
      isValid: !data, // true si no existe (data es null)
      message: data 
        ? `Ya existe una asignatura con este ${field}` 
        : 'Disponible'
    };

    
    return res.json(response);

  } catch (error) {
    console.error('🔥 Error:', error);
    return res.status(500).json({
      isValid: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;