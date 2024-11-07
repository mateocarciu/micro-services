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
    // Log pour afficher la réception des données de la requête
    const { userId, items } = await c.req.json();
    console.log('Received request data:', { userId, items });

    // Vérification des données
    if (!isValidObjectId(userId) || !Array.isArray(items)) {
      console.log('Invalid userId or items');
      return c.json({ message: 'Invalid userId or items' }, 400);
    }

    // Log pour vérifier que les données sont valides
    console.log('userId and items are valid. Proceeding to create the order.');

    // Vérification de la validité de chaque itemId dans les items
    const invalidItems = items.filter(item => !isValidObjectId(item.itemId));
    if (invalidItems.length > 0) {
      console.log('Invalid itemIds found:', invalidItems);
      return c.json({ message: 'One or more itemIds are invalid' }, 400);
    }

    // Log pour vérifier les éléments des items
    items.forEach((item, index) => {
      console.log(`Item ${index}:`, item);
      if (!item.itemId || !item.itemName) {
        console.log(`Invalid item structure at index ${index}:`, item);
      }
    });

    // Création de la nouvelle commande
    console.log('Creating new order...');
    const newOrder = new Order({ userId, items, status: 'pending' });

    // Log avant la sauvegarde
    console.log('Order object created:', newOrder);

    // Tentative de sauvegarde de la commande
    const savedOrder = await newOrder.save();

    // Log après la sauvegarde réussie
    console.log('Order saved successfully:', savedOrder);

    return c.json(savedOrder, 201);
  } catch (err: any) {
    // Log pour l'erreur
    console.error('Error occurred while creating order:', err.message);
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
      return c.json({ message: 'Invalid order ID' }, 200);
    }

    const order = await Order.findById(orderId).populate('userId items.itemId');
    if (!order) {
      return c.json({ message: 'Order not found' }, 200);
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
 * PATCH /:id - Partially updates an order by ID.
 */
router.patch('/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const updates = await c.req.json(); // Get the fields to update from the request body

    if (!isValidObjectId(orderId)) {
      return c.json({ message: 'Invalid order ID' }, 400);
    }

    const validFields = ['status', 'userId', 'items']; // Define the fields allowed for updates
    const updateData = {};

    // Only add valid fields to updateData
    for (const key in updates) {
      if (validFields.includes(key)) {
        updateData[key] = updates[key];
      }
    }

    // If no valid fields are provided, return a 400 error
    if (Object.keys(updateData).length === 0) {
      return c.json({ message: 'No valid fields to update' }, 400);
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return c.json({ message: 'Order not found' }, 404);
    }

    return c.json(updatedOrder);
  } catch (err) {
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
