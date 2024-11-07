const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const menuController = require('../controllers/menu');

// Get all menu items
router.get('/', auth, menuController.getAllMenuItems);

// Get one menu item by ID
router.get('/:id', auth, menuController.getOneMenuItem);

// Add a new menu item
router.post('/', auth, menuController.addMenuItem);

// Update a menu item by ID
router.put('/:id', auth, menuController.updateMenuItemById);

// Delete a menu item by ID
router.delete('/:id', auth, menuController.deleteMenuItemById);

module.exports = router;
