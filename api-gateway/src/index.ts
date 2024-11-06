import { serve } from '@hono/node-server';
import apiGateway from './apiGateway';

const port = 3000
console.log(`API Gateway running on port ${port}`);

serve({
  fetch: apiGateway.fetch,
  port,
});
