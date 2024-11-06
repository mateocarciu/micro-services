import { Hono } from 'hono';
import Order from '../models/order';
import { isValidObjectId } from 'mongoose';
import { myEnv } from '../../conf'

const router = new Hono();

// Hardcoded API key for middleware validation
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

  // Call next() if the API key is correct
  return await next();
};

// Apply middleware to all routes
router.use('*', apiKeyMiddleware);

/**
 * POST /orders/
 * Creates a new order.
 * - Required Header: Authorization: Bearer hardcoded_secure_api_key
 * - Required Body: JSON with `userId` (string) and `items` (array of objects with `itemId` and `itemName`)
 * - Example Request:
 *   POST /orders/
 *   Headers: { "Authorization": "Bearer hardcoded_secure_api_key" }
 *   Body: { "userId": "<userId>", "items": [{ "itemId": "<itemId>", "itemName": "Item Name" }] }
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
 * GET /orders/:id
 * Retrieves a single order by ID.
 * - Required Header: Authorization: Bearer hardcoded_secure_api_key
 * - Example Request:
 *   GET /orders/<orderId>
 *   Headers: { "Authorization": "Bearer hardcoded_secure_api_key" }
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
 * GET /orders/
 * Retrieves all orders.
 * - Required Header: Authorization: Bearer hardcoded_secure_api_key
 * - Example Request:
 *   GET /orders/
 *   Headers: { "Authorization": "Bearer hardcoded_secure_api_key" }
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
 * PUT /orders/:id
 * Updates an order's status by ID.
 * - Required Header: Authorization: Bearer hardcoded_secure_api_key
 * - Required Body: JSON with `status` (one of: "pending", "accepted", "closed", "canceled")
 * - Example Request:
 *   PUT /orders/<orderId>
 *   Headers: { "Authorization": "Bearer hardcoded_secure_api_key" }
 *   Body: { "status": "accepted" }
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

export default router;