import { User } from '../models';
import { IUser, ICreateUser } from '../interfaces';

export class UserRepository {
  private users: Map<string, User> = new Map();

  public async create(data: ICreateUser): Promise<User> {
    const hashedPassword = await User.hashPassword(data.password);
    const user = new User({ ...data, password: hashedPassword });
    this.users.set(user.id, user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }
    return null;
  }

  public async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }

  public async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
