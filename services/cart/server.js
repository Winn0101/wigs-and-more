const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/wigs-cart', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Cart Service: MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Cart Schema
const cartItemSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  wigId: { type: String, required: true },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  imageUrl: String,
  addedAt: { type: Date, default: Date.now }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cart' });
});

// Get cart items for a session
app.get('/api/cart/:sessionId', async (req, res) => {
  try {
    const items = await CartItem.find({ sessionId: req.params.sessionId });
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
app.post('/api/cart/:sessionId', async (req, res) => {
  try {
    const { wigId, name, price, imageUrl } = req.body;
    const sessionId = req.params.sessionId;
    
    // Check if item already in cart
    let cartItem = await CartItem.findOne({ sessionId, wigId });
    
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      cartItem = new CartItem({
        sessionId,
        wigId,
        name,
        price,
        imageUrl,
        quantity: 1
      });
      await cartItem.save();
    }
    
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
app.put('/api/cart/:sessionId/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOneAndUpdate(
      { _id: req.params.itemId, sessionId: req.params.sessionId },
      { quantity },
      { new: true }
    );
    
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
app.delete('/api/cart/:sessionId/:itemId', async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({
      _id: req.params.itemId,
      sessionId: req.params.sessionId
    });
    
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
app.delete('/api/cart/:sessionId', async (req, res) => {
  try {
    await CartItem.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Cart Service running on port ${PORT}`);
});