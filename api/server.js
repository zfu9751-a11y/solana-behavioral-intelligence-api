/**
 * Solana Behavioral Intelligence API
 * Version: v1
 * Chain: Solana
 * Type: Infrastructure Layer
 */

const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const API_VERSION = 'v1';
const SUPPORTED_CHAIN = 'solana';

app.use(cors());
app.use(express.json());

app.use(`/api/${API_VERSION}`, analysisRoutes);

app.listen(PORT, () => {
  console.log(`Solana Behavioral Intelligence API v1 running on port ${PORT}`);
});

module.exports = app;
