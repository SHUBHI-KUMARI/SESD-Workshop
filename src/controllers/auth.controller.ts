import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { ICreateUser, ILoginUser } from '../interfaces';
import { ValidationError } from '../utils';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = this.validateRegisterInput(req.body);
      const result = await this.authService.register(userData);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData = this.validateLoginInput(req.body);
      const result = await this.authService.login(loginData);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError(['User not authenticated']);
      }
      const user = await this.authService.getUserById(req.user.userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  private validateRegisterInput(data: unknown): ICreateUser {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError(['Request body must be an object']);
    }

    const user = data as Record<string, unknown>;

    if (!user.email || typeof user.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push('Email must be a valid email address');
    }

    if (!user.password || typeof user.password !== 'string') {
      errors.push('Password is required and must be a string');
    } else if ((user.password as string).length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
      errors.push('Name is required and must be a non-empty string');
    }

    if (user.role !== undefined) {
      if (user.role !== 'admin' && user.role !== 'user') {
        errors.push('Role must be either "admin" or "user"');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return {
      email: (user.email as string).toLowerCase().trim(),
      password: user.password as string,
      name: (user.name as string).trim(),
      role: user.role as 'admin' | 'user' | undefined,
    };
  }

  private validateLoginInput(data: unknown): ILoginUser {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      throw new ValidationError(['Request body must be an object']);
    }

    const user = data as Record<string, unknown>;

    if (!user.email || typeof user.email !== 'string') {
      errors.push('Email is required and must be a string');
    }

    if (!user.password || typeof user.password !== 'string') {
      errors.push('Password is required and must be a string');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return {
      email: (user.email as string).toLowerCase().trim(),
      password: user.password as string,
    };
  }
}
