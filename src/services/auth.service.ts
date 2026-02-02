import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories';
import { ICreateUser, ILoginUser, IAuthResponse, IUserResponse } from '../interfaces';
import { BadRequestError, ConflictError, NotFoundError } from '../utils';

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  public async register(data: ICreateUser): Promise<IAuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user
    const user = await this.userRepository.create(data);
    
    // Generate token
    const token = this.generateToken(user.id, user.role);

    return {
      user: user.toResponse(),
      token,
    };
  }

  public async login(data: ILoginUser): Promise<IAuthResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user.id, user.role);

    return {
      user: user.toResponse(),
      token,
    };
  }

  public async getUserById(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user.toResponse();
  }

  public verifyToken(token: string): { userId: string; role: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; role: string };
      return decoded;
    } catch (error) {
      throw new BadRequestError('Invalid or expired token');
    }
  }

  private generateToken(userId: string, role: string): string {
    const expiresIn = this.jwtExpiresIn;
    return jwt.sign(
      { userId, role },
      this.jwtSecret,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );
  }
}
