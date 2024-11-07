import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { DbConnect } from './db';
import menu from './routes/menu';

const app = new Hono();
await DbConnect();

const port = 3001;
console.log(`Server is running on port ${port}`);

app.route('/api/menu', menu);

// Fix: Return the response in the 404 handler
app.notFound((c) => {
  return c.json({ msg: '404 oups' }, 404);
});

serve({
  fetch: app.fetch,
  port
});

