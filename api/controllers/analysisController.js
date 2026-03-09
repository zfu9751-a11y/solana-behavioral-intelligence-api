/**
 * Analysis Controller
 * Solana Wallet Analysis API Controller
 */
const { analyzeWallet, isValidSolanaAddress } = require('../services/behaviorAnalysisService');

async function getAnalysis(req, res) {
  const { address } = req.params;
  if (!isValidSolanaAddress(address)) {
    return res.status(400).json({
      error: 'Invalid address format',
      message: 'Please provide a valid Solana wallet address'
    });
  }
  try {
    const result = await analyzeWallet(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      stack: error.stack
    });
  }
}

module.exports = {
  getAnalysis
};
