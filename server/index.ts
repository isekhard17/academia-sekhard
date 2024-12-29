import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { requireAuth, requireRoles } from './middleware/auth';
import type { Database } from '../src/types/database';
import authRoutes from './routes/auth';
import asignaturasRouter from './routes/asignaturas';
import seccionesRouter from './routes/secciones';
import evaluacionesRouter from './routes/evaluaciones';
import notasRouter from './routes/notas';
import asistenciasRouter from './routes/asistencias';
import alumnosRouter from './routes/alumnos';
import adminRouter from './routes/admin';
import profesoresRouter from './routes/profesores';
import validationsRouter from './routes/validations';
import unidadesRouter from './routes/unidades';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://krozkihpuukaoonrxahs.supabase.co");
  next();
});

// Supabase client for server
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Make supabase client available in requests
declare global {
  namespace Express {
    interface Request {
      supabase: ReturnType<typeof createClient<Database>>;
    }
  }
}

app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Rutas específicas para alumnos
app.use('/api/alumnos', requireAuth, requireRoles(['alumno']), alumnosRouter);

// Rutas administrativas
app.use('/api/admin', requireAuth, requireRoles(['admin']), adminRouter);

// Agregamos la ruta de validaciones ANTES de las rutas protegidas
// porque la validación no requiere autenticación
app.use('/api/validations', validationsRouter);

// Rutas protegidas para admin y profesores
app.use('/api/asignaturas', requireAuth, requireRoles(['admin', 'profesor']), asignaturasRouter);
app.use('/api/secciones', requireAuth, seccionesRouter);
app.use('/api/evaluaciones', requireAuth, requireRoles(['admin', 'profesor']), evaluacionesRouter);
app.use('/api/notas', requireAuth, requireRoles(['admin', 'profesor']), notasRouter);
app.use('/api/asistencias', requireAuth, requireRoles(['admin', 'profesor']), asistenciasRouter);
app.use('/api/profesores', requireAuth, requireRoles(['admin']), profesoresRouter);
app.use('/api/unidades', requireAuth, requireRoles(['admin', 'profesor']), unidadesRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});