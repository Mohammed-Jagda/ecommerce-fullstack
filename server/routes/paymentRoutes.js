const express = require('express');
const router = express.Router();
const { createPaymentIntent, mockPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/mock', protect, mockPayment);

module.exports = router;