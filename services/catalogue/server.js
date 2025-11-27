const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/wigs-catalogue', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Catalogue Service: MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Wig Schema
const wigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: String,
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Wig = mongoose.model('Wig', wigSchema);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'catalogue' });
});

// Get all wigs
app.get('/api/wigs', async (req, res) => {
  try {
    const wigs = await Wig.find();
    res.json(wigs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single wig
app.get('/api/wigs/:id', async (req, res) => {
  try {
    const wig = await Wig.findById(req.params.id);
    if (!wig) return res.status(404).json({ error: 'Wig not found' });
    res.json(wig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new wig
app.post('/api/wigs', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    
    const wig = new Wig({
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      category,
      inStock: inStock === 'true'
    });
    
    await wig.save();
    res.status(201).json(wig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update wig
app.put('/api/wigs/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const updateData = { name, description, price: parseFloat(price), category, inStock: inStock === 'true' };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const wig = await Wig.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!wig) return res.status(404).json({ error: 'Wig not found' });
    res.json(wig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete wig
app.delete('/api/wigs/:id', async (req, res) => {
  try {
    const wig = await Wig.findByIdAndDelete(req.params.id);
    if (!wig) return res.status(404).json({ error: 'Wig not found' });
    res.json({ message: 'Wig deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Catalogue Service running on port ${PORT}`);
});