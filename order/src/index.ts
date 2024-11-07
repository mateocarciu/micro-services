import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { DbConnect } from './db';
import orders from './routes/orders';

const app = new Hono();
await DbConnect();

const port = 3000;
console.log(`Server is running on port ${port}`);

// Mount orders router at /api/orders
app.route('/api/orders', orders);

// 404 handler
app.notFound((c) => {
  return c.json({ msg: '404 oups' }, 404);
});

serve({
  fetch: app.fetch,
  port
});
