import { serve } from '@hono/node-server';
import mongoose from 'mongoose';
import { config } from './config/config';
import apiGateway from './apiGateway';

const port = 3000

// Connexion à MongoDB
mongoose.connect(config.database.url)
  .then(() => {
    console.log('Connected to MongoDB');
    
    console.clear(); // Nettoie la console
    console.log(`Starting API Gateway on port ${port}`);
    console.log('Environment variables loaded:', {
      USER_SERVICE_URL: process.env.USER_SERVICE_URL,
      USER_SERVICE_API_KEY: process.env.USER_SERVICE_API_KEY ? 'Set' : 'Not set'
    });

    // Démarrage du serveur une fois connecté à MongoDB
    serve({
      fetch: apiGateway.fetch,
      port,
    });
    
    console.log(`API Gateway running on port ${port}`);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });



