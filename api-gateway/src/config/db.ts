import mongoose from 'mongoose';
import { config } from './config';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url);
    console.log('Connected to Gateway Database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};