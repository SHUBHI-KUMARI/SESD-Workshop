import { v4 as uuidv4 } from 'uuid';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces';

export class Book implements IBook {
  public id: string;
  public title: string;
  public author: string;
  public isbn: string;
  public genre: string;
  public publishedYear: number;
  public price: number;
  public quantity: number;
  public description?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: ICreateBook) {
    this.id = uuidv4();
    this.title = data.title;
    this.author = data.author;
    this.isbn = data.isbn;
    this.genre = data.genre;
    this.publishedYear = data.publishedYear;
    this.price = data.price;
    this.quantity = data.quantity;
    this.description = data.description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public update(data: IUpdateBook): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.author !== undefined) this.author = data.author;
    if (data.isbn !== undefined) this.isbn = data.isbn;
    if (data.genre !== undefined) this.genre = data.genre;
    if (data.publishedYear !== undefined) this.publishedYear = data.publishedYear;
    if (data.price !== undefined) this.price = data.price;
    if (data.quantity !== undefined) this.quantity = data.quantity;
    if (data.description !== undefined) this.description = data.description;
    this.updatedAt = new Date();
  }

  public toJSON(): IBook {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      genre: this.genre,
      publishedYear: this.publishedYear,
      price: this.price,
      quantity: this.quantity,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
