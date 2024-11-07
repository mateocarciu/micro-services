const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/order');

// Define the routes as you did before
router.get('/', auth, orderController.getAllOrders);
router.get('/id/:id', auth, orderController.getOrderById);
router.post('/', auth, orderController.createOrder);
router.patch('/:id', auth, orderController.updateOrderById);
router.get('/customer/:customerId', auth, orderController.getOrdersByCustomerId);
router.get('/livreur/:livreurId', auth, orderController.getOrdersByLivreurId);
router.get('/status/:status', auth, orderController.getOrdersByStatus);

module.exports = router;
