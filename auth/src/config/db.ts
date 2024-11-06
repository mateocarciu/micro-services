import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const { MONGODB_USER, MONGODB_PWD, MONGODB_CLUSTER, MONGODB_DATABASE } = process.env;

    if (!MONGODB_USER || !MONGODB_PWD || !MONGODB_CLUSTER || !MONGODB_DATABASE) {
      throw new Error('MongoDB environment variables are not properly defined');
    }

    // Format d'URI correct pour MongoDB Atlas
    const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PWD}@${MONGODB_CLUSTER}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 10000, // 10 secondes de timeout pour la connexion
      socketTimeoutMS: 45000,  // 45 secondes de timeout pour les opérations
    });
    
    console.log('MongoDB connected successfully');
  } catch (err) {
    if (err instanceof Error) {
      console.error('MongoDB connection error:', {
        message: err.message,
        stack: err.stack
      });
    } else {
      console.error('Unknown MongoDB connection error:', err);
    }
    process.exit(1);
  }
};

export default connectDB;