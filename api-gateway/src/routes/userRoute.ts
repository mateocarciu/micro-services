import { Hono } from 'hono';
import { UserService } from '../services/userService';
import { verifyToken } from '../middlewares/authMiddleware';

const userRoutes = new Hono();
const userService = new UserService();

userRoutes.use('*', verifyToken);

userRoutes.get('/', async (c) => {
  return c.json(await userService.getUsers());
});

userRoutes.get('/:id', async (c) => {
  const userId = c.req.param('id');
  const user = c.get('user');
  
  if (user.userId !== userId && user.role !== 'admin') {
    return c.json({ message: 'Accès non autorisé' }, 403);
  }

  return c.json(await userService.getUserById(userId));
});

export default userRoutes;