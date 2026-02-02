export interface IBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publishedYear: number;
  price: number;
  quantity: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBook {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publishedYear: number;
  price: number;
  quantity: number;
  description?: string;
}

export interface IUpdateBook {
  title?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  publishedYear?: number;
  price?: number;
  quantity?: number;
  description?: string;
}
