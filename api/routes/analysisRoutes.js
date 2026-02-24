/**
 * Analysis Routes
 * Solana Wallet Analysis API Routes
 */

const express = require('express');
const router = express.Router();
const { getAnalysis } = require('../controllers/analysisController');

router.get('/solana/wallet/:address/analysis', getAnalysis);

module.exports = router;
