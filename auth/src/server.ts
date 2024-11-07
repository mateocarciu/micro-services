import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes'

dotenv.config();

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

export default app;