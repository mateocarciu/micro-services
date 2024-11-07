import { Hono } from 'hono';
import { AuthService } from '../services/authService';
import { TokenService } from '../services/tokenService';

const authRoutes = new Hono();
const authService = new AuthService();
const tokenService = new TokenService();

authRoutes.post('/login', async (c) => {
  const credentials = await c.req.json();
  const userData = await authService.login(credentials);
  
  const token = await tokenService.generateToken({
    userId: userData.user.id,
    role: userData.user.role
  });

  return c.json({ ...userData, token });
});

authRoutes.post('/logout', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    await tokenService.invalidateToken(token);
  }
  return c.json({ message: 'Déconnexion réussie' });
});

export default authRoutes;