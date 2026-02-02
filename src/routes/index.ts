import { Router } from 'express';
import bookRoutes from './book.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/books', bookRoutes);
router.use('/auth', authRoutes);

export default router;
