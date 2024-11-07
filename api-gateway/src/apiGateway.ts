import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
// Import other routes...

const apiGateway = new Hono();

apiGateway.use('*', cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

// Mount routes
apiGateway.route('/auth', authRoutes);
apiGateway.route('/api/users', userRoutes);
// Mount other routes...

export default apiGateway;