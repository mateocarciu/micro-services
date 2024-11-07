import { Context, Next } from 'hono';
import { TokenService } from '../services/tokenService';
import { HTTPException } from 'hono/http-exception';

const tokenService = new TokenService();

export const verifyToken = async (c: Context, next: Next) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new HTTPException(401, { message: 'Token non fourni' });
    }

    const decoded = await tokenService.verifyToken(token);
    c.set('user', decoded);
    await next();
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(401, { message: error.message });
    }
    throw new HTTPException(401, { message: 'Token invalide' });
  }
};