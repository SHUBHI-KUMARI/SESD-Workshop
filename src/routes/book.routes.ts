import { Router } from 'express';
import { BookController } from '../controllers';
import { BookService } from '../services';
import { BookRepository } from '../repositories';

const router = Router();

// Initialize dependencies (Dependency Injection)
const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

// Book routes
router.post('/', bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;
