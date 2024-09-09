import { Hono } from 'hono';
import MenuItem from '../models/menu';
import { isValidObjectId } from 'mongoose';

const router = new Hono().basePath('/menu');

// GET /menu - Retrieve the list of all available menu items
router.get('/', async (c) => {
  try {
    const menuItems = await MenuItem.find({ availability: true });
    return c.json(menuItems);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// POST /menu - Add a new item to the menu
router.post('/', async (c) => {
  const { name, description, price, category, availability, imageUrl } = await c.req.json();

  if (!name || !description || !price || !category) {
    return c.json({ message: 'All fields are required except imageUrl' }, 400);
  }

  try {
    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      availability: availability !== undefined ? availability : true,
      imageUrl: imageUrl || ''
    });
    const savedMenuItem = await newMenuItem.save();
    return c.json(savedMenuItem, 201);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// PUT /menu/:id - Update the availability of a menu item
router.put('/:id', async (c) => {
  const menuItemId = c.req.param('id');
  const { availability } = await c.req.json();

  if (!isValidObjectId(menuItemId)) {
    return c.json({ message: 'Invalid menu item ID' }, 400);
  }

  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      { availability: availability !== undefined ? availability : true },
      { new: true }
    );

    if (!updatedMenuItem) {
      return c.json({ message: 'Menu item not found' }, 404);
    }

    return c.json(updatedMenuItem);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

// GET /menu/:id - Retrieve details of a specific menu item
router.get('/:id', async (c) => {
  const menuItemId = c.req.param('id');

  if (!isValidObjectId(menuItemId)) {
    return c.json({ message: 'Invalid menu item ID' }, 400);
  }

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return c.json({ message: 'Menu item not found' }, 404);
    }
    return c.json(menuItem);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
});

export default router;
