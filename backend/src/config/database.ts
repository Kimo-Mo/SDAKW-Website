import dns from 'dns';
dns.setServers(['0.0.0.0', '8.8.8.8']);
import mongoose from 'mongoose';
import { env } from './env';

/**
 * Establishes a Mongoose connection to MongoDB.
 * On failure, logs the error and exits the process — the app should not
 * run without a database connection.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(env.MONGODB_URI);

    console.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Gracefully closes the Mongoose connection.
 * Called during process shutdown to avoid leaving open handles.
 */
export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
  console.info('MongoDB connection closed.');
};
