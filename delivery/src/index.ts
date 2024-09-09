import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {DbConnect} from './db'

import deliveries from './routes/deliveries'


const app = new Hono()
await DbConnect()

const port = 3000
console.log(`Server is running on port ${port}`)

app.route('/api', deliveries)

app.use("*", async (c) => {
  await c.json({ msg: '404 oups' });
});

serve({
  fetch: app.fetch,
  port
})
