import express, { Application, Request, Response, NextFunction } from 'express';
import routes from './routes';
import { errorHandler } from './middlewares';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Health check route
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', message: 'Server is running' });
    });

    // API routes
    this.app.use('/api', routes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ success: false, message: 'Route not found' });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;
