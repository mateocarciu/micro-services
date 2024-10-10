import { Hono } from 'hono';
import Order from '../models/order';
import { isValidObjectId } from 'mongoose';

const router = new Hono().basePath('/orders');

// Create a new order
router.post('/', async (c) => {
  const { userId, items } = await c.req.json();

  if (!isValidObjectId(userId) || !Array.isArray(items)) {
    return c.json({ message: 'Invalid userId or items' }, 400);
  }

  try {
    const newOrder = new Order({ userId, items, status: 'pending' });
    const savedOrder = await newOrder.save();
    return c.json(savedOrder, 201);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Get a single order by ID
router.get('/:id', async (c) => {
  const orderId = c.req.param('id');

  if (!isValidObjectId(orderId)) {
    return c.json({ message: 'Invalid order ID' }, 400);
  }

  try {
    const order = await Order.findById(orderId).populate('userId items.itemId');
    if (!order) {
      return c.json({ message: 'Order not found' }, 404);
    }
    return c.json(order);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Get all orders
router.get('/', async (c) => {
  try {
    const orders = await Order.find().populate('userId items.itemId');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Update an order's status by ID
router.put('/:id', async (c) => {
  const orderId = c.req.param('id');
  const { status } = await c.req.json();

  if (!isValidObjectId(orderId)) {
    return c.json({ message: 'Invalid order ID' }, 400);
  }

  if (!['pending', 'accepted', 'closed', 'canceled'].includes(status)) {
    return c.json({ message: 'Invalid status' }, 400);
  }

  try {
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
