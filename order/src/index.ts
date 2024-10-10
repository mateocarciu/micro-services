import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { DbConnect } from './db';


import orders from './routes/orders'; // Import the new orders routes

const app = new Hono();
await DbConnect();

const port = 3000;
console.log(`Server is running on port ${port}`);


app.route('/api', orders); // Register the orders routes

app.use("*", async (c) => {
  await c.json({ msg: '404 oups' });
});

serve({
  fetch: app.fetch,
  port
});

