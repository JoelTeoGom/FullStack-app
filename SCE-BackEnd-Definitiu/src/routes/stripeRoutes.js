const express = require('express');
const { handleWebhook, createCheckoutSession } = require('../controllers/stripeController');
const authenticateToken = require('../middlewares/authMiddleware'); // Import the authentication middleware
const router = express.Router();

router.post('/process-checkout', express.raw({ type: 'application/json' }), handleWebhook);

router.post('/create-checkout-session', authenticateToken, express.json(), createCheckoutSession);

module.exports = router;
