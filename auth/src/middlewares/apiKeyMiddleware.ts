import { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction): void | Response => {
  const apiKey = req.header('X-API-KEY');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  next();
};