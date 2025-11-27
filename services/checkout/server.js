const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/wigs-checkout', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Checkout Service: MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [{
    wigId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Generate order number
function generateOrderNumber() {
  return 'WIG' + Date.now() + Math.floor(Math.random() * 1000);
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'checkout' });
});

// Create order
app.post('/api/checkout', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, totalAmount, sessionId } = req.body;
    
    // Validate input
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      status: 'completed'
    });
    
    await order.save();
    
    // Clear cart after successful checkout
    if (sessionId) {
      const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://cart-service:3002';
      try {
        await axios.delete(`${CART_SERVICE_URL}/api/cart/${sessionId}`);
      } catch (error) {
        console.error('Error clearing cart:', error.message);
      }
    }
    
    res.status(201).json({
      message: 'Order completed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by order number
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Checkout Service running on port ${PORT}`);
});