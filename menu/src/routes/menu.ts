import { Hono } from 'hono';
import MenuItem from '../models/menu'; // Assuming each menu item is a separate document
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

  // Call next() if the API key is correct
  return await next();
};

// Apply middleware to all routes
router.use('*', apiKeyMiddleware);

// Route to add a new menu item
router.post('/items', async (c) => {
  try {
    const { menuItemName, availabilityStatus } = await c.req.json();

    if (!menuItemName) {
      return c.json({ message: 'Menu item name is required' }, 400);
    }

    const newItem = new MenuItem({
      menuItemName,
      availabilityStatus: availabilityStatus !== undefined ? availabilityStatus : true,
    });

    const savedItem = await newItem.save();
    return c.json(savedItem, 201);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Route to delete a menu item by ID
router.delete('/items/:id', async (c) => {
  try {
    const itemId = c.req.param('id');

    if (!isValidObjectId(itemId)) {
      return c.json({ message: 'Invalid item ID' }, 400);
    }

    const deletedItem = await MenuItem.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return c.json({ message: 'Menu item not found' }, 404);
    }

    return c.json({ message: 'Menu item deleted successfully' });
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Route to update a menu item by ID
// Route to partially update a menu item by ID
router.patch('/items/:id', async (c) => {
  try {
    const itemId = c.req.param('id');
    const updates = await c.req.json(); // Get the fields to update from the request body

    if (!isValidObjectId(itemId)) {
      return c.json({ message: 'Invalid item ID' }, 400);
    }

    const validFields = ['menuItemName', 'availabilityStatus']; // Define fields allowed for updates
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

    const updatedItem = await MenuItem.findByIdAndUpdate(itemId, updateData, { new: true });

    if (!updatedItem) {
      return c.json({ message: 'Menu item not found' }, 404);
    }

    return c.json(updatedItem);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});


// Retrieve all menu items
router.get('/items', async (c) => {
  try {
    const items = await MenuItem.find();
    return c.json(items);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// Retrieve a single menu item by ID
router.get('/items/:id', async (c) => {
  try {
    const itemId = c.req.param('id');

    if (!isValidObjectId(itemId)) {
      return c.json({ message: 'Invalid item ID' }, 400);
    }

    const item = await MenuItem.findById(itemId);
    if (!item) {
      return c.json({ message: 'Menu item not found' }, 404);
    }

    return c.json(item);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

export default router;
