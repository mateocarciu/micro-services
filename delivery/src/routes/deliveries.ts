import { Hono } from 'hono';
import Delivery from '../models/delivery';
import { isValidObjectId } from 'mongoose';

const router = new Hono().basePath('/deliveries');

// Get the list of orders ready to be delivered
router.get('/orders', async (c) => {
  try {
    const orders = await Delivery.find({ status: 'pending' }).populate('order deliveryPerson');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Assign an order to a delivery person
router.post('/assign', async (c) => {
  const { order_id, deliveryPerson_id } = await c.req.json();

  if (!isValidObjectId(order_id) || !isValidObjectId(deliveryPerson_id)) {
    return c.json({ message: 'Invalid order_id or deliveryPerson_id' }, 400);
  }

  try {
    const newDelivery = new Delivery({
      order: order_id,
      deliveryPerson: deliveryPerson_id,
      status: 'in progress',
      assignmentDate: new Date()
    });
    const savedDelivery = await newDelivery.save();
    return c.json(savedDelivery, 201);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Update the delivery status
router.put('/orders/:id/status', async (c) => {
  const deliveryId = c.req.param('id');
  const { status } = await c.req.json();

  if (!isValidObjectId(deliveryId)) {
    return c.json({ message: 'Invalid delivery ID' }, 400);
  }

  if (!['in progress', 'delivered'].includes(status)) {
    return c.json({ message: 'Invalid status' }, 400);
  }

  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status, deliveryDate: status === 'delivered' ? new Date() : undefined },
      { new: true }
    );

    if (!updatedDelivery) {
      return c.json({ message: 'Delivery not found' }, 404);
    }

    return c.json(updatedDelivery);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Get details of an order in delivery
router.get('/orders/:id', async (c) => {
  const deliveryId = c.req.param('id');

  if (!isValidObjectId(deliveryId)) {
    return c.json({ message: 'Invalid delivery ID' }, 400);
  }

  try {
    const delivery = await Delivery.findById(deliveryId).populate('order deliveryPerson');
    if (!delivery) {
      return c.json({ message: 'Delivery not found' }, 404);
    }
    return c.json(delivery);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

export default router;
