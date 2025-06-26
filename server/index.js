// File: server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads .env file

const userRoutes = require('./routes/userRoutes');
const artefactRoutes = require('./routes/artefactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();
const bidRoutes = require('./routes/bidRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/pay', paymentRoutes);
//  Routes
app.use('/api/users', userRoutes);
app.use('/api/artefacts', artefactRoutes);
app.use('/api/bids', bidRoutes);
// Default route (optional)
app.get('/', (req, res) => {
  res.send('Hands2Heart API is running.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
