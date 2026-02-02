import { ICreateBook, IUpdateBook, IQueryParams } from '../interfaces';
import { ValidationError } from './errors';

export class BookValidator {
  public static validateCreateBook(data: unknown): ICreateBook {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError(['Request body must be an object']);
    }

    const book = data as Record<string, unknown>;

    // Required fields
    if (!book.title || typeof book.title !== 'string' || book.title.trim() === '') {
      errors.push('Title is required and must be a non-empty string');
    }

    if (!book.author || typeof book.author !== 'string' || book.author.trim() === '') {
      errors.push('Author is required and must be a non-empty string');
    }

    if (!book.isbn || typeof book.isbn !== 'string' || book.isbn.trim() === '') {
      errors.push('ISBN is required and must be a non-empty string');
    } else if (!/^[\d-]{10,17}$/.test(book.isbn as string)) {
      errors.push('ISBN must be a valid format (10-13 digits, may include hyphens)');
    }

    if (!book.genre || typeof book.genre !== 'string' || book.genre.trim() === '') {
      errors.push('Genre is required and must be a non-empty string');
    }

    if (book.publishedYear === undefined || typeof book.publishedYear !== 'number') {
      errors.push('Published year is required and must be a number');
    } else if (book.publishedYear < 1000 || book.publishedYear > new Date().getFullYear()) {
      errors.push(`Published year must be between 1000 and ${new Date().getFullYear()}`);
    }

    if (book.price === undefined || typeof book.price !== 'number') {
      errors.push('Price is required and must be a number');
    } else if (book.price < 0) {
      errors.push('Price must be a positive number');
    }

    if (book.quantity === undefined || typeof book.quantity !== 'number') {
      errors.push('Quantity is required and must be a number');
    } else if (book.quantity < 0 || !Number.isInteger(book.quantity)) {
      errors.push('Quantity must be a non-negative integer');
    }

    // Optional fields
    if (book.description !== undefined && typeof book.description !== 'string') {
      errors.push('Description must be a string');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return {
      title: (book.title as string).trim(),
      author: (book.author as string).trim(),
      isbn: (book.isbn as string).trim(),
      genre: (book.genre as string).trim(),
      publishedYear: book.publishedYear as number,
      price: book.price as number,
      quantity: book.quantity as number,
      description: book.description ? (book.description as string).trim() : undefined,
    };
  }

  public static validateUpdateBook(data: unknown): IUpdateBook {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError(['Request body must be an object']);
    }

    const book = data as Record<string, unknown>;
    const updateData: IUpdateBook = {};

    // Optional fields with validation
    if (book.title !== undefined) {
      if (typeof book.title !== 'string' || book.title.trim() === '') {
        errors.push('Title must be a non-empty string');
      } else {
        updateData.title = book.title.trim();
      }
    }

    if (book.author !== undefined) {
      if (typeof book.author !== 'string' || book.author.trim() === '') {
        errors.push('Author must be a non-empty string');
      } else {
        updateData.author = book.author.trim();
      }
    }

    if (book.isbn !== undefined) {
      if (typeof book.isbn !== 'string' || book.isbn.trim() === '') {
        errors.push('ISBN must be a non-empty string');
      } else if (!/^[\d-]{10,17}$/.test(book.isbn)) {
        errors.push('ISBN must be a valid format (10-13 digits, may include hyphens)');
      } else {
        updateData.isbn = book.isbn.trim();
      }
    }

    if (book.genre !== undefined) {
      if (typeof book.genre !== 'string' || book.genre.trim() === '') {
        errors.push('Genre must be a non-empty string');
      } else {
        updateData.genre = book.genre.trim();
      }
    }

    if (book.publishedYear !== undefined) {
      if (typeof book.publishedYear !== 'number') {
        errors.push('Published year must be a number');
      } else if (book.publishedYear < 1000 || book.publishedYear > new Date().getFullYear()) {
        errors.push(`Published year must be between 1000 and ${new Date().getFullYear()}`);
      } else {
        updateData.publishedYear = book.publishedYear;
      }
    }

    if (book.price !== undefined) {
      if (typeof book.price !== 'number') {
        errors.push('Price must be a number');
      } else if (book.price < 0) {
        errors.push('Price must be a positive number');
      } else {
        updateData.price = book.price;
      }
    }

    if (book.quantity !== undefined) {
      if (typeof book.quantity !== 'number') {
        errors.push('Quantity must be a number');
      } else if (book.quantity < 0 || !Number.isInteger(book.quantity)) {
        errors.push('Quantity must be a non-negative integer');
      } else {
        updateData.quantity = book.quantity;
      }
    }

    if (book.description !== undefined) {
      if (typeof book.description !== 'string') {
        errors.push('Description must be a string');
      } else {
        updateData.description = book.description.trim();
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    if (Object.keys(updateData).length === 0) {
      throw new ValidationError(['At least one field must be provided for update']);
    }

    return updateData;
  }

  public static validateId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError(['ID is required and must be a non-empty string']);
    }
  }

  public static validateQueryParams(query: Record<string, unknown>): IQueryParams {
    const validatedQuery: IQueryParams = {};
    const errors: string[] = [];

    // Pagination
    if (query.page !== undefined) {
      const page = Number(query.page);
      if (isNaN(page) || page < 1 || !Number.isInteger(page)) {
        errors.push('Page must be a positive integer');
      } else {
        validatedQuery.page = page;
      }
    }

    if (query.limit !== undefined) {
      const limit = Number(query.limit);
      if (isNaN(limit) || limit < 1 || limit > 100 || !Number.isInteger(limit)) {
        errors.push('Limit must be an integer between 1 and 100');
      } else {
        validatedQuery.limit = limit;
      }
    }

    // Sorting
    const allowedSortFields = ['title', 'author', 'genre', 'publishedYear', 'price', 'quantity', 'createdAt', 'updatedAt'];
    if (query.sortBy !== undefined) {
      if (typeof query.sortBy !== 'string' || !allowedSortFields.includes(query.sortBy)) {
        errors.push(`sortBy must be one of: ${allowedSortFields.join(', ')}`);
      } else {
        validatedQuery.sortBy = query.sortBy;
      }
    }

    if (query.sortOrder !== undefined) {
      if (query.sortOrder !== 'asc' && query.sortOrder !== 'desc') {
        errors.push('sortOrder must be either "asc" or "desc"');
      } else {
        validatedQuery.sortOrder = query.sortOrder;
      }
    }

    // Search
    if (query.search !== undefined) {
      if (typeof query.search !== 'string') {
        errors.push('Search must be a string');
      } else {
        validatedQuery.search = query.search.trim();
      }
    }

    // Filters
    if (query.genre !== undefined) {
      if (typeof query.genre !== 'string') {
        errors.push('Genre filter must be a string');
      } else {
        validatedQuery.genre = query.genre.trim();
      }
    }

    if (query.author !== undefined) {
      if (typeof query.author !== 'string') {
        errors.push('Author filter must be a string');
      } else {
        validatedQuery.author = query.author.trim();
      }
    }

    if (query.minPrice !== undefined) {
      const minPrice = Number(query.minPrice);
      if (isNaN(minPrice) || minPrice < 0) {
        errors.push('minPrice must be a non-negative number');
      } else {
        validatedQuery.minPrice = minPrice;
      }
    }

    if (query.maxPrice !== undefined) {
      const maxPrice = Number(query.maxPrice);
      if (isNaN(maxPrice) || maxPrice < 0) {
        errors.push('maxPrice must be a non-negative number');
      } else {
        validatedQuery.maxPrice = maxPrice;
      }
    }

    if (query.minYear !== undefined) {
      const minYear = Number(query.minYear);
      if (isNaN(minYear) || minYear < 1000) {
        errors.push('minYear must be a valid year (>= 1000)');
      } else {
        validatedQuery.minYear = minYear;
      }
    }

    if (query.maxYear !== undefined) {
      const maxYear = Number(query.maxYear);
      if (isNaN(maxYear) || maxYear > new Date().getFullYear()) {
        errors.push(`maxYear must be a valid year (<= ${new Date().getFullYear()})`);
      } else {
        validatedQuery.maxYear = maxYear;
      }
    }

    // Cross-field validation
    if (validatedQuery.minPrice !== undefined && validatedQuery.maxPrice !== undefined) {
      if (validatedQuery.minPrice > validatedQuery.maxPrice) {
        errors.push('minPrice cannot be greater than maxPrice');
      }
    }

    if (validatedQuery.minYear !== undefined && validatedQuery.maxYear !== undefined) {
      if (validatedQuery.minYear > validatedQuery.maxYear) {
        errors.push('minYear cannot be greater than maxYear');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return validatedQuery;
  }
}
