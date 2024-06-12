require('dotenv').config(); // Load environment variables from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppDataSource = require('../data-source');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

const createCheckoutSession = async (req, res) => {
  try {
    const { line_items } = req.body;
    const customer_email = req.user.email;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      customer_email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the event for debugging purposes
  //console.log('Received event:', event);

  // Handle the event
  switch (event.type) {

    case 'checkout.session.completed':
      const session = event.data.object;
      const customer_email = session.customer_email;

      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        console.log('Checkout Session completed!', lineItems);
        await checkout(lineItems.data, customer_email);
      } catch (error) {
        console.error('Error listing line items:', error.message);
      }
      //console.log('Checkout Session completed!', session);
      // Handle the checkout session completed event if needed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send();
};

// Checkout function to create order, update stock, and clear cart
const checkout = async (line_items, customer_email) => {
  const productRepository = AppDataSource.getRepository(Product);
  const userRepository = AppDataSource.getRepository(User);
  const orderRepository = AppDataSource.getRepository(Order);
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);
  const cartRepository = AppDataSource.getRepository(Cart);

  try {
    // Find the user by email
    const user = await userRepository.findOne({ where: { email: customer_email } });
    if (!user) {
      console.error(`User with email ${customer_email} not found`);
      return;
    }

    const userId = user.id;
    console.log('User ID:', userId);

    // Extract product IDs and quantities from line items
    const productIds = [];
    const quantities = [];

    for (const item of line_items) {
      const product = await productRepository.findOne({ where: { stripePriceId: item.price.id } });
      if (product) {
        productIds.push(product.id);
        quantities.push(item.quantity);
      }
    }
    console.log('Product IDs:', productIds);
    console.log('Quantities:', quantities);

    if (!productIds.length || productIds.length !== quantities.length) {
      console.error('Invalid product IDs or quantities');
      return;
    }

    // Create the order
    const order = orderRepository.create({ userId });
    await orderRepository.save(order);

    // Associate products with the order
    for (let i = 0; i < productIds.length; i++) {
      const product = await productRepository.findOne({ where: { id: productIds[i] } });
      if (!product) {
        console.error(`Product with ID ${productIds[i]} not found`);
        return;
      }

      const orderProduct = orderProductRepository.create({
        orderId: order.id,
        productId: product.id,
        quantity: quantities[i],
      });
      await orderProductRepository.save(orderProduct);

      // Update product stock
      product.stock -= quantities[i];
      await productRepository.save(product);
    }

    // Clear all items from the user's cart
    await cartRepository.delete({ userId });

    console.log('Order created successfully', order);
  } catch (error) {
    console.error('Server error', error.message);
  }
};

module.exports = { createCheckoutSession, handleWebhook };
