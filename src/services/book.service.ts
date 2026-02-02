import { BookRepository } from '../repositories';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces';
import { NotFoundError, ConflictError, BadRequestError } from '../utils';

export class BookService {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  public async createBook(data: ICreateBook): Promise<IBook> {
    // Check if book with same ISBN already exists
    const existingBook = await this.bookRepository.findByIsbn(data.isbn);
    if (existingBook) {
      throw new ConflictError(`Book with ISBN ${data.isbn} already exists`);
    }

    return this.bookRepository.create(data);
  }

  public async getBookById(id: string): Promise<IBook> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID ${id} not found`);
    }
    return book;
  }

  public async getAllBooks(): Promise<IBook[]> {
    return this.bookRepository.findAll();
  }

  public async updateBook(id: string, data: IUpdateBook): Promise<IBook> {
    // Check if book exists
    const existingBook = await this.bookRepository.findById(id);
    if (!existingBook) {
      throw new NotFoundError(`Book with ID ${id} not found`);
    }

    // If updating ISBN, check for duplicates
    if (data.isbn && data.isbn !== existingBook.isbn) {
      const bookWithIsbn = await this.bookRepository.findByIsbn(data.isbn);
      if (bookWithIsbn) {
        throw new ConflictError(`Book with ISBN ${data.isbn} already exists`);
      }
    }

    const updatedBook = await this.bookRepository.update(id, data);
    if (!updatedBook) {
      throw new BadRequestError('Failed to update book');
    }

    return updatedBook;
  }

  public async deleteBook(id: string): Promise<void> {
    const exists = await this.bookRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Book with ID ${id} not found`);
    }

    await this.bookRepository.delete(id);
  }

  public async getBookCount(): Promise<number> {
    return this.bookRepository.count();
  }
}
