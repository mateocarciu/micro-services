import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {DbConnect} from './db'

import deliveries from './routes/deliveries'
import cuisines from './routes/cuisines'
import menu from './routes/menu'


const app = new Hono()
await DbConnect()

const port = 3000
console.log(`Server is running on port ${port}`)

app.route('/api', deliveries)
app.route('/api', cuisines)
app.route('/api', menu)

app.use("*", async (c) => {
  await c.json({ msg: '404 oups' });
});

serve({
  fetch: app.fetch,
  port
})
