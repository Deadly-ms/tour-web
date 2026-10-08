import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/db';
import apiRoutes from './routes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { clerkMiddleware } from "@clerk/express";

const app: Application = express();

// Middleware: CORS
app.use(
  cors({
    origin: [config.corsOrigin, process.env.FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware: Body Parsing & Auth
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// API Routes
app.use('/api', apiRoutes);

// 404 Handler for unmatched routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  // Attempt Database connection
  await connectDB();

  app.listen(config.port, () => {
    logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    logger.info(`Health check available at http://localhost:${config.port}/api/health`);
  });
};

startServer();

export default app;