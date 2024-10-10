import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
