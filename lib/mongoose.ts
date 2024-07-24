

import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';

const mongoUrl: string = process.env.MONGODB_URL as string;

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

if (!mongoUrl) {
  throw new Error('MONGODB_URL environment variable is not defined');
}

export const connectToDatabase = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(mongoUrl, {
        ...clientOptions,
        dbName: "HLSDB",
      });
      console.log('MongoDB connected successfully');
      
      // Check if the connection is ready and access the admin method
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log('MongoDB connection is active');
        return;
      } else {
        console.error('MongoDB connection is not active');
      }
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error);

      // If it's the last retry, throw the error
      if (i === retries - 1) {
        throw new Error('MongoDB connection failed after multiple attempts');
      }

      // Wait for a specified delay before the next retry
      await new Promise(res => setTimeout(res, delay));
    }
  }
};


