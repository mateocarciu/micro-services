const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// Configuration de CORS pour autoriser l'origine http://localhost:3003
app.use(cors({
  origin: '*', // L'origine front-end
  credentials: true // Si tu veux permettre les cookies et les en-têtes d'autorisation
}));

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// Connexion à MongoDB
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/microservice-user?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);

module.exports = app;
