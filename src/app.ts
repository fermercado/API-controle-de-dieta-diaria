import express, { Express } from 'express';
import userRoutes from './routes/userRoutes';
import mealRoutes from './routes/mealRoutes';
import dotenv from 'dotenv';

dotenv.config();

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(userRoutes, mealRoutes);

  return app;
}
