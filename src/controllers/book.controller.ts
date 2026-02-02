import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services';
import { ICreateBook, IUpdateBook } from '../interfaces';
import { BookValidator } from '../utils';

export class BookController {
  private bookService: BookService;

  constructor(bookService: BookService) {
    this.bookService = bookService;
  }

  public createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookData = BookValidator.validateCreateBook(req.body);
      const book = await this.bookService.createBook(bookData);
      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      BookValidator.validateId(id);
      const book = await this.bookService.getBookById(id);
      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams = BookValidator.validateQueryParams(req.query as Record<string, unknown>);
      const result = await this.bookService.getBooksWithQuery(queryParams);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      BookValidator.validateId(id);
      const updateData = BookValidator.validateUpdateBook(req.body);
      const book = await this.bookService.updateBook(id, updateData);
      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      BookValidator.validateId(id);
      await this.bookService.deleteBook(id);
      res.status(200).json({
        success: true,
        message: 'Book deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
