const axios = require('axios');


const API_BASE_URL = 'http://localhost:3001/api/menu'; // Replace with the actual URL of your microservice

// Set up axios instance with the API key for authorization
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Bearer test_api_key`
    }
});

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
    try {
        const response = await apiClient.get('/items');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Get one menu item by ID
exports.getOneMenuItem = async (req, res) => {
    try {
        const response = await apiClient.get(`/items/${req.params.id}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Add a new menu item
exports.addMenuItem = async (req, res) => {
    try {
        const { menuItemName, availabilityStatus } = req.body;

        if (!menuItemName) {
            return res.status(400).json({ message: 'Menu item name is required' });
        }

        const response = await apiClient.post('/items', { menuItemName, availabilityStatus });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Update a menu item by ID
exports.updateMenuItemById = async (req, res) => {
    try {
        const updates = req.body; // Get the fields to update from the request body
        const itemId = req.params.id;

        // Make a PATCH request to update only the provided fields
        const response = await apiClient.patch(`/items/${itemId}`, updates);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};


// Delete a menu item by ID
exports.deleteMenuItemById = async (req, res) => {
    try {
        const itemId = req.params.id;

        await apiClient.delete(`/items/${itemId}`);
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
