import { Hono } from 'hono';
import dotenv from 'dotenv';

dotenv.config();

const apiGateway = new Hono();

// URLs des microservices depuis les variables d'environnement
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const KITCHEN_SERVICE_URL = process.env.KITCHEN_SERVICE_URL;
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;

// Middleware de base pour gérer les erreurs
apiGateway.use('*', async (c, next) => {
  try {
    await next();
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Fonction utilitaire pour gérer les requêtes avec fetch
async function fetchJson(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur: ${response.status} - ${errorText}`);
  }
  return await response.json();
}

// Routes vers le Service de Gestion des Clients
apiGateway.get('/users/:id', async (c) => {
  const userId = c.req.param('id');
  const data = await fetchJson(`${USER_SERVICE_URL}/${userId}`);
  return c.json(data);
});

apiGateway.post('/users/register', async (c) => {
  const userData = await c.req.json();
  const data = await fetchJson(`${USER_SERVICE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return c.json(data);
});

// Routes vers le Service des Commandes
apiGateway.get('/orders/:id', async (c) => {
  const orderId = c.req.param('id');
  const data = await fetchJson(`${ORDER_SERVICE_URL}/${orderId}`);
  return c.json(data);
});

apiGateway.post('/orders', async (c) => {
  const orderData = await c.req.json();
  const data = await fetchJson(`${ORDER_SERVICE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return c.json(data);
});

// Routes vers le Service de Cuisine
apiGateway.get('/kitchen/orders', async (c) => {
  const data = await fetchJson(`${KITCHEN_SERVICE_URL}/orders`);
  return c.json(data);
});

apiGateway.put('/kitchen/orders/:id/status', async (c) => {
  const orderId = c.req.param('id');
  const { status } = await c.req.json();
  const data = await fetchJson(`${KITCHEN_SERVICE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return c.json(data);
});

// Routes vers le Service de Livraison
apiGateway.get('/deliveries/orders', async (c) => {
  const data = await fetchJson(`${DELIVERY_SERVICE_URL}/orders`);
  return c.json(data);
});

apiGateway.post('/deliveries/assign', async (c) => {
  const assignData = await c.req.json();
  const data = await fetchJson(`${DELIVERY_SERVICE_URL}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignData),
  });
  return c.json(data);
});

apiGateway.put('/deliveries/orders/:id/status', async (c) => {
  const deliveryId = c.req.param('id');
  const { status } = await c.req.json();
  const data = await fetchJson(`${DELIVERY_SERVICE_URL}/orders/${deliveryId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return c.json(data);
});

// Route par défaut pour les erreurs 404
apiGateway.all('*', (c) => {
  return c.json({ message: 'Route non trouvée' }, 404);
});

export default apiGateway;
