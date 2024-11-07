import { Hono } from 'hono';
import Order from '../models/order';
import { isValidObjectId } from 'mongoose';
import { myEnv } from '../../conf';

const router = new Hono();

// Middleware to check the API key
const apiKeyMiddleware = async (c, next) => {
  const apiKey = c.req.header('Authorization');
  const expectedApiKey = `Bearer ${myEnv.API_KEY}`;

  if (apiKey !== expectedApiKey) {
    return c.json({
      message: 'Unauthorized',
      reason: `Received API key was: ${apiKey ? apiKey : 'None'}`,
      expectedFormat: 'Bearer <API_KEY>'
    }, 401);
  }

  return await next();
};

// Apply middleware to all routes
router.use('*', apiKeyMiddleware);

/**
 * POST / - Creates a new order.
 */
router.post('/', async (c) => {
  try {
    const { userId, items } = await c.req.json();

    if (!isValidObjectId(userId) || !Array.isArray(items)) {
      return c.json({ message: 'Invalid userId or items' }, 400);
    }

    const newOrder = new Order({ userId, items, status: 'pending' });
    const savedOrder = await newOrder.save();
    return c.json(savedOrder, 201);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * GET /:id - Retrieves a single order by ID.
 */
router.get('/:id', async (c) => {
  try {
    const orderId = c.req.param('id');

    if (!isValidObjectId(orderId)) {
      return c.json({ message: 'Invalid order ID' }, 400);
    }

    const order = await Order.findById(orderId).populate('userId items.itemId');
    if (!order) {
      return c.json({ message: 'Order not found' }, 404);
    }
    return c.json(order);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * GET / - Retrieves all orders.
 */
router.get('/', async (c) => {
  try {
    const orders = await Order.find().populate('userId items.itemId');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * PUT /:id - Updates an order's status by ID.
 */
router.put('/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const { status } = await c.req.json();

    if (!isValidObjectId(orderId)) {
      return c.json({ message: 'Invalid order ID' }, 400);
    }

    if (!['pending', 'accepted', 'closed', 'canceled'].includes(status)) {
      return c.json({ message: 'Invalid status' }, 400);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return c.json({ message: 'Order not found' }, 404);
    }

    return c.json(updatedOrder);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * GET /customer/:customerId - Retrieves all orders for a specific customerId.
 */
router.get('/customer/:customerId', async (c) => {
  try {
    const { customerId } = c.req.param();

    if (!customerId) {
      return c.json({ message: 'Invalid customerId' }, 400);
    }

    const orders = await Order.find({ customerId }).populate('items.itemId');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * GET /livreur/:livreurId - Retrieves all orders for a specific livreurId.
 */
router.get('/livreur/:livreurId', async (c) => {
  try {
    const { livreurId } = c.req.param();

    if (!livreurId) {
      return c.json({ message: 'Invalid livreurId' }, 400);
    }

    const orders = await Order.find({ livreurId }).populate('items.itemId');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * GET /status/:status - Retrieves all orders with a specific status.
 */
router.get('/status/:status', async (c) => {
  try {
    const { status } = c.req.param();

    const validStatuses = ['pending', 'accepted', 'pending-delivery', 'delivering', 'closed'];
    if (!validStatuses.includes(status)) {
      return c.json({ message: 'Invalid status' }, 400);
    }

    const orders = await Order.find({ status }).populate('items.itemId');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

export default router;
