// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://FinalYearProject:IamMonkeyDLuffy@cluster0.5wahh.mongodb.net/SignBridgeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error: ', err));

// Define Sign Schema
const signSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  code: String,
  motionData: Object
});

const Sign = mongoose.model('Sign', signSchema);

// Routes
app.get('/api/signs', async (req, res) => {
  try {
    const signs = await Sign.find({});
    res.json(signs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/signs/:name', async (req, res) => {
  try {
    const sign = await Sign.findOne({ name: req.params.name.toUpperCase() });
    if (!sign) return res.status(404).json({ message: 'Sign not found' });
    res.json(sign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/signs', async (req, res) => {
  try {
    const newSign = new Sign(req.body);
    const savedSign = await newSign.save();
    res.status(201).json(savedSign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/signs/:id', async (req, res) => {
  try {
    const deleted = await Sign.deleteOne({ id: req.params.id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'Sign not found' });
    }
    res.json({ message: 'Sign deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));