import { Router } from 'express';
import { BookController } from '../controllers';
import { BookService } from '../services';
import { BookRepository } from '../repositories';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// Initialize dependencies (Dependency Injection)
const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes (require authentication)
router.post('/', authenticate, authorize('admin'), bookController.createBook);
router.put('/:id', authenticate, authorize('admin'), bookController.updateBook);
router.delete('/:id', authenticate, authorize('admin'), bookController.deleteBook);

export default router;
