const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/payment/create-intent
// @access  Consumer
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in rupees

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'inr',
      metadata: { userId: req.user._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock payment (for testing without real Stripe keys)
// @route   POST /api/payment/mock
// @access  Consumer
const mockPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    // Simulate a successful payment
    const mockPaymentIntentId = `mock_pi_${Date.now()}_${req.user._id}`;

    res.json({
      success: true,
      paymentIntentId: mockPaymentIntentId,
      message: `Mock payment of ₹${amount} successful`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent, mockPayment };