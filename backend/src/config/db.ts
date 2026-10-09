import mongoose from 'mongoose';
import { config } from './env';
import { seedTours } from '../utils/seedTours';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    // Auto-seed tours if database is empty
    await seedTours();
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${(error as Error).message}`);
    // In production/Phase 1 we log warning so health checks can still run even if local mongo is offline
  }
};

