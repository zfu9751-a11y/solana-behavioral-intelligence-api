/**
 * Solana Behavioral Intelligence SDK
 * Version: v1
 */

const API_BASE_URL = 'http://localhost:3001/api/v1';

/**
 * Analyze a Solana wallet
 * @param {string} address - Solana wallet address
 * @returns {Promise<Object>} Analysis result
 */
export async function analyzeWallet(address) {
  const res = await fetch(`${API_BASE_URL}/solana/wallet/${address}/analysis`);
  return res.json();
}
