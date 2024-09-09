import { Hono } from 'hono';
import CuisineOrder from '../models/cuisine';
import { isValidObjectId } from 'mongoose';

const router = new Hono().basePath('/cuisine');

// GET /cuisine/orders - Retrieve the list of orders pending for the kitchen
router.get('/orders', async (c) => {
  try {
    const orders = await CuisineOrder.find({ status: 'pending' }).populate('order');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// PUT /cuisine/orders/:id/status - Update the status of an order in the kitchen
router.put('/orders/:id/status', async (c) => {
  const orderId = c.req.param('id');
  const { status, preparedBy } = await c.req.json();

  if (!isValidObjectId(orderId)) {
    return c.json({ message: 'Invalid order ID' }, 400);
  }

  if (!['in preparation', 'ready to serve'].includes(status)) {
    return c.json({ message: 'Invalid status' }, 400);
  }

  try {
    const updatedOrder = await CuisineOrder.findByIdAndUpdate(
      orderId,
      { 
        status, 
        preparedBy: preparedBy ? preparedBy : undefined,
        updatedAt: new Date() 
      },
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

// GET /cuisine/orders/:id - Retrieve details of a specific order for the kitchen
router.get('/orders/:id', async (c) => {
  const orderId = c.req.param('id');

  if (!isValidObjectId(orderId)) {
    return c.json({ message: 'Invalid order ID' }, 400);
  }

  try {
    const order = await CuisineOrder.findById(orderId).populate('order preparedBy');
    if (!order) {
      return c.json({ message: 'Order not found' }, 404);
    }
    return c.json(order);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

export default router;
