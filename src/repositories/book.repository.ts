import { Book } from '../models';
import { IBook, ICreateBook, IUpdateBook, IQueryParams, IPaginatedResult } from '../interfaces';

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

  public async findWithQuery(query: IQueryParams): Promise<IPaginatedResult<IBook>> {
    let books = Array.from(this.books.values()).map(book => book.toJSON());

    // Apply search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      books = books.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower) ||
        book.genre.toLowerCase().includes(searchLower) ||
        (book.description && book.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (query.genre) {
      books = books.filter(book => 
        book.genre.toLowerCase() === query.genre!.toLowerCase()
      );
    }

    if (query.author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(query.author!.toLowerCase())
      );
    }

    if (query.minPrice !== undefined) {
      books = books.filter(book => book.price >= query.minPrice!);
    }

    if (query.maxPrice !== undefined) {
      books = books.filter(book => book.price <= query.maxPrice!);
    }

    if (query.minYear !== undefined) {
      books = books.filter(book => book.publishedYear >= query.minYear!);
    }

    if (query.maxYear !== undefined) {
      books = books.filter(book => book.publishedYear <= query.maxYear!);
    }

    // Apply sorting
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    
    books.sort((a, b) => {
      const aValue = a[sortBy as keyof IBook];
      const bValue = b[sortBy as keyof IBook];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalItems = books.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedBooks = books.slice(startIndex, endIndex);

    return {
      data: paginatedBooks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
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
