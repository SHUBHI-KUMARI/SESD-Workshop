import { Book } from '../models';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces';

export class BookRepository {
  private books: Map<string, Book> = new Map();

  public async create(data: ICreateBook): Promise<IBook> {
    const book = new Book(data);
    this.books.set(book.id, book);
    return book.toJSON();
  }

  public async findById(id: string): Promise<IBook | null> {
    const book = this.books.get(id);
    return book ? book.toJSON() : null;
  }

  public async findAll(): Promise<IBook[]> {
    return Array.from(this.books.values()).map(book => book.toJSON());
  }

  public async findByIsbn(isbn: string): Promise<IBook | null> {
    for (const book of this.books.values()) {
      if (book.isbn === isbn) {
        return book.toJSON();
      }
    }
    return null;
  }

  public async update(id: string, data: IUpdateBook): Promise<IBook | null> {
    const book = this.books.get(id);
    if (!book) {
      return null;
    }
    book.update(data);
    return book.toJSON();
  }

  public async delete(id: string): Promise<boolean> {
    return this.books.delete(id);
  }

  public async count(): Promise<number> {
    return this.books.size;
  }

  public async exists(id: string): Promise<boolean> {
    return this.books.has(id);
  }
}
