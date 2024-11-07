const axios = require('axios');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3002/api/orders', {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching all orders:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !Array.isArray(items)) {
            return res.status(400).json({ message: 'userId and items are required' });
        }

        const response = await axios.post('http://localhost:3002/api/orders', { userId, items }, {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const response = await axios.get(`http://localhost:3002/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching order by ID:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Partially update an order by ID
exports.updateOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updates = req.body;

        const response = await axios.patch(`http://localhost:3002/api/orders/${orderId}`, updates, {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error updating order by ID:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Get all orders for a specific customerId
exports.getOrdersByCustomerId = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const response = await axios.get(`http://localhost:3002/api/orders/customer/${customerId}`, {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching orders by customerId:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Get all orders for a specific livreurId
exports.getOrdersByLivreurId = async (req, res) => {
    try {
        const livreurId = req.params.livreurId;
        const response = await axios.get(`http://localhost:3002/api/orders/livreur/${livreurId}`, {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching orders by livreurId:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// Get all orders with a specific status
exports.getOrdersByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const response = await axios.get(`http://localhost:3002/api/orders/status/${status}`, {
            headers: {
                'Authorization': `Bearer test_api_key`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching orders by status:", error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
