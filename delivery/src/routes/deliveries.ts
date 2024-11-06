import { Hono } from 'hono';
import Delivery from '../models/delivery';
import { isValidObjectId } from 'mongoose';
import {myEnv} from '../../conf'



const router = new Hono().basePath('/deliveries');

// Middleware to check the API key
const apiKeyMiddleware = async (c, next) => {
  const apiKey = c.req.header('Authorization');
  console.log('Received Authorization Header:', apiKey); // Log the received header
  
  const expectedApiKey = `Bearer ${myEnv.API_KEY}`;

  if (apiKey !== expectedApiKey) {
    return c.json({
      message: 'Unauthorized',
      reason: `Received API key was: ${apiKey ? apiKey : 'None'}`,
      expectedFormat: 'Bearer <API_KEY>'
    }, 401);
  }

  await next();
};

// Apply the middleware to all routes
router.use('*', apiKeyMiddleware);

/**
 * GET /deliveries/orders
 * Query: Returns a list of orders ready to be delivered.
 * - Required Header: Authorization: Bearer <API_KEY>
 * - Example Request: GET /deliveries/orders
 */
router.get('/orders', async (c) => {
  try {
    const orders = await Delivery.find({ status: 'pending' }).populate('order deliveryPerson');
    return c.json(orders);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

/**
 * POST /deliveries/assign
 * Query: Assigns an order to a delivery person.
 * - Required Header: Authorization: Bearer <API_KEY>
 * - Example JSON Payload: { "order_id": "<orderId>", "deliveryPerson_id": "<deliveryPersonId>" }
 * - Example Request: POST /deliveries/assign
 */
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

/**
 * PUT /deliveries/orders/:id/status
 * Query: Updates the delivery status for a specific order.
 * - Required Header: Authorization: Bearer <API_KEY>
 * - Example URL Param: /deliveries/orders/<deliveryId>/status
 * - Example JSON Payload: { "status": "in progress" | "delivered" }
 * - Example Request: PUT /deliveries/orders/<deliveryId>/status
 */
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

/**
 * GET /deliveries/orders/:id
 * Query: Retrieves details of a specific order in delivery.
 * - Required Header: Authorization: Bearer <API_KEY>
 * - Example URL Param: /deliveries/orders/<deliveryId>
 * - Example Request: GET /deliveries/orders/<deliveryId>
 */
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
