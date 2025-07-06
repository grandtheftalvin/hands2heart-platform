// File: server/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Loads .env file

const userRoutes = require('./routes/userRoutes');
const artefactRoutes = require('./routes/artefactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bidRoutes = require('./routes/bidRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('server/uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/artefacts', artefactRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('Hands2Heart API is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
