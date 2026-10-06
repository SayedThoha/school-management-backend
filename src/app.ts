import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API Routes
  app.use('/api', apiRouter);

  // 404 Route Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
