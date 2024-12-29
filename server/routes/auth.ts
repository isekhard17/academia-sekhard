import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.signIn(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/validate-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Token no proporcionado');
    }

    const user = await authService.validateToken(token);
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;