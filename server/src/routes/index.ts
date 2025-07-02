import { Router } from 'express';
import { geminiRouter } from './gemini.routes';

const router = Router();

// API routes
router.use('/ai', geminiRouter);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
