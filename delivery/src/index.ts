import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { DbConnect } from './db';
import deliveries from './routes/deliveries';

const app = new Hono();
await DbConnect();

const port = 3000;
console.log(`Server is running on port ${port}`);

// Apply the /api base route for deliveries
app.route('/api', deliveries);

// 404 Handler - Apply this after all routes
app.notFound((c) => {
  return c.json({ msg: '404 oups' }, 404);
});

serve({
  fetch: app.fetch,
  port,
});
