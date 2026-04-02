const express = require('express');
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
//const { isAdmin } = require('../middleware/errorMiddleware'); // you should have this

// ✅ Consumer routes
router.post('/', protect, placeOrder);              // Place order
router.get('/mine', protect, getMyOrders);          // Get my orders
router.get('/:id', protect, getOrderById);          // Get single order

// ✅ Admin routes
router.get('/', protect, adminOnly, getAllOrders);    // Get all orders
router.put('/:id/status', protect, adminOnly, updateOrderStatus); // Update status

module.exports = router;