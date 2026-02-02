import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { IUser, ICreateUser, IUserResponse } from '../interfaces';

export class User implements IUser {
  public id: string;
  public email: string;
  public password: string;
  public name: string;
  public role: 'admin' | 'user';
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: ICreateUser) {
    this.id = uuidv4();
    this.email = data.email.toLowerCase();
    this.password = data.password;
    this.name = data.name;
    this.role = data.role || 'user';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public toJSON(): IUser {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public toResponse(): IUserResponse {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
