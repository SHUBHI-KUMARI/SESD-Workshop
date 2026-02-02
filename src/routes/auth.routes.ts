import { Router } from 'express';
import { AuthController } from '../controllers';
import { AuthService } from '../services';
import { UserRepository } from '../repositories';
import { authenticate } from '../middlewares';

const router = Router();

// Initialize dependencies
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
