// src/apiGateway.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './config/config';
import { validateApiKey } from './middlewares/apiKeyMiddleware';

const apiGateway = new Hono();

// Middleware CORS
apiGateway.use('*', cors({
  origin: '*',
  credentials: true
}));

// Middleware de logging

  apiGateway.use('*', async (c, next) => {
    console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
    await next();
  });

apiGateway.use('*', validateApiKey);

// Proxy toutes les requêtes /api/auth vers le microservice utilisateur

apiGateway.all('/api/auth/*', async (c) => {
  const path = c.req.path.replace('/api/auth', '');
  const url = `${config.services.user.url}/api/auth${path}`;
  
  try {
    const response = await fetch(url, {
      method: c.req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.services.user.apiKey // On ajoute l'API_KEY ici
      },
      body: c.req.method !== 'GET' ? await c.req.text() : undefined
    });

    const data = await response.json();
    return c.json(data, response.status);
  } catch (error) {
    console.error('Proxy error:', error);
    return c.json({ message: 'Service indisponible' }, 502);
  }
});

// Proxy toutes les requêtes /api/users vers le microservice utilisateur
apiGateway.all('/api/users/*', async (c) => {
  const path = c.req.path.replace('/api/users', '');
  const url = `${config.services.user.url}/api/users${path}`;
  
  try {
    const response = await fetch(url, {
      method: c.req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.services.user.apiKey // On ajoute l'API_KEY ici
      },
      body: c.req.method !== 'GET' ? await c.req.text() : undefined
    });

    const data = await response.json();
    return c.json(data, response.status);
  } catch (error) {
    console.error('Proxy error:', error);
    return c.json({ message: 'Service indisponible' }, 502);
  }
});

export default apiGateway;