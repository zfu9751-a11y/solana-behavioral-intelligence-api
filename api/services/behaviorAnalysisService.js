const fetch = require('node-fetch');
/**
 * Behavior Analysis Service
 * Solana Wallet Behavioral Analytics — powered by Helius API
 */

const API_VERSION = 'v1';
const SUPPORTED_CHAIN = 'solana';
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

function isValidSolanaAddress(address) {
  if (!address || typeof address !== 'string') return false;
  if (address.length < 32 || address.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
}

async function fetchTransactions(address) {
  const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Helius transactions error: ${res.status}`);
  return res.json();
}

async function fetchBalances(address) {
  const url = `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${HELIUS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Helius balances error: ${res.status}`);
  return res.json();
}

function analyzeTransactions(transactions) {
  const types = {};
  let totalVolume = 0;
  const timestamps = [];
  let tokenTransferCount = 0;
  const uniqueTokens = new Set();
  let receivedCount = 0;
  let sentCount = 0;

  for (const tx of transactions) {
    const type = tx.type || 'UNKNOWN';
    types[type] = (types[type] || 0) + 1;

    if (tx.nativeTransfers) {
      for (const t of tx.nativeTransfers) {
        totalVolume += t.amount || 0;
      }
    }

    if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
      tokenTransferCount += tx.tokenTransfers.length;
      for (const t of tx.tokenTransfers) {
        if (t.mint) uniqueTokens.add(t.mint);
        if (t.toUserAccount) receivedCount++;
        if (t.fromUserAccount) sentCount++;
      }
    }

    if (tx.timestamp) timestamps.push(tx.timestamp);
  }

  let avgTimeBetweenTx = null;
  if (timestamps.length > 1) {
    const sorted = [...timestamps].sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      gaps.push((sorted[i] - sorted[i - 1]) / 3600);
    }
    avgTimeBetweenTx = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  }

  return { types, totalVolume, avgTimeBetweenTx, txCount: transactions.length, tokenTransferCount, uniqueTokenCount: uniqueTokens.size, receivedCount, sentCount };
}

function classifyArchetype(txAnalysis, balances) {
  const { types, avgTimeBetweenTx, txCount, uniqueTokenCount, sentCount, receivedCount } = txAnalysis;

  const nftCount = (types['NFT_SALE'] || 0) + (types['NFT_MINT'] || 0) + (types['NFT_BID'] || 0);
  const swapCount = types['SWAP'] || 0;
  const stakeCount = (types['STAKE_SOL'] || 0) + (types['UNSTAKE_SOL'] || 0);
  const defiCount = (types['ADD_LIQUIDITY'] || 0) + (types['REMOVE_LIQUIDITY'] || 0);

  if (nftCount > txCount * 0.4) return 'NFT Collector';
  if (stakeCount > txCount * 0.3) return 'Yield Farmer';
  if (defiCount > txCount * 0.2) return 'DeFi Strategist';
  if (avgTimeBetweenTx !== null && avgTimeBetweenTx < 1) return 'High-Frequency Trader';
  if (swapCount > txCount * 0.5) return 'Momentum Surfer';
  if (uniqueTokenCount > 20 && sentCount > receivedCount * 1.5) return 'Active Distributor';
  return 'Diamond Hands';
}

function detectPatterns(txAnalysis) {
  const { types, avgTimeBetweenTx, txCount, tokenTransferCount, uniqueTokenCount, sentCount, receivedCount } = txAnalysis;
  const patterns = [];

  const swapCount = types['SWAP'] || 0;
  const nftCount = (types['NFT_SALE'] || 0) + (types['NFT_MINT'] || 0);
  const stakeCount = (types['STAKE_SOL'] || 0) + (types['UNSTAKE_SOL'] || 0);
  const defiCount = (types['ADD_LIQUIDITY'] || 0) + (types['REMOVE_LIQUIDITY'] || 0);
  const transferCount = types['TRANSFER'] || 0;

  if (swapCount > 0) patterns.push({ pattern: 'Token swapping', confidence: Math.min(0.99, 0.5 + swapCount / txCount) });
  if (avgTimeBetweenTx !== null && avgTimeBetweenTx < 2) patterns.push({ pattern: 'High-frequency trading', confidence: Math.min(0.99, 0.5 + (2 - avgTimeBetweenTx) / 2) });
  if (nftCount > 0) patterns.push({ pattern: 'NFT trading', confidence: Math.min(0.99, 0.5 + nftCount / txCount) });
  if (stakeCount > 0) patterns.push({ pattern: 'Staking', confidence: Math.min(0.99, 0.5 + stakeCount / txCount) });
  if (defiCount > 0) patterns.push({ pattern: 'Liquidity provision', confidence: Math.min(0.99, 0.5 + defiCount / txCount) });

  if (tokenTransferCount > 0 && receivedCount > sentCount * 1.5) {
    patterns.push({ pattern: 'Token accumulation', confidence: Math.min(0.99, 0.5 + (receivedCount / Math.max(tokenTransferCount, 1)) * 0.5) });
  }
  if (tokenTransferCount > 0 && sentCount > receivedCount * 1.5) {
    patterns.push({ pattern: 'Token distribution', confidence: Math.min(0.99, 0.5 + (sentCount / Math.max(tokenTransferCount, 1)) * 0.5) });
  }
  if (uniqueTokenCount > 10) {
    patterns.push({ pattern: 'Diverse portfolio', confidence: Math.min(0.99, 0.5 + Math.min(uniqueTokenCount / 50, 0.49)) });
  }
  if (avgTimeBetweenTx !== null && avgTimeBetweenTx > 24) {
    patterns.push({ pattern: 'Long-term holding', confidence: Math.min(0.99, 0.5 + Math.min(avgTimeBetweenTx / 200, 0.49)) });
  }
  if (transferCount > txCount * 0.5) {
    patterns.push({ pattern: 'Transfer activity', confidence: Math.min(0.99, 0.5 + transferCount / txCount * 0.5) });
  }

  return patterns.sort((a, b) => b.confidence - a.confidence).slice(0, 4).map(p => ({ ...p, confidence: parseFloat(p.confidence.toFixed(2)) }));
}

function calculateRiskScore(txAnalysis, balances) {
  const { avgTimeBetweenTx, txCount, types, uniqueTokenCount, tokenTransferCount } = txAnalysis;
  let score = 20;

  if (avgTimeBetweenTx !== null && avgTimeBetweenTx < 1) score += 25;
  else if (avgTimeBetweenTx !== null && avgTimeBetweenTx < 6) score += 10;

  if (txCount > 50) score += 20;
  else if (txCount > 20) score += 10;

  const swapRatio = (types['SWAP'] || 0) / Math.max(txCount, 1);
  score += Math.round(swapRatio * 25);

  const stakeRatio = ((types['STAKE_SOL'] || 0) + (types['UNSTAKE_SOL'] || 0)) / Math.max(txCount, 1);
  score -= Math.round(stakeRatio * 10);

  if (uniqueTokenCount > 50) score += 15;
  else if (uniqueTokenCount > 20) score += 8;

  if (tokenTransferCount > 200) score += 10;
  else if (tokenTransferCount > 50) score += 5;

  return Math.min(100, Math.max(0, score));
}

function buildPortfolioOverview(balances) {
  const solBalance = (balances.nativeBalance || 0) / 1e9;
  const tokens = (balances.tokens || []).filter(t => t.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 5).map(t => t.symbol || t.mint?.slice(0, 6) || 'UNKNOWN');
  return { sol_balance: parseFloat(solBalance.toFixed(4)), token_count: (balances.tokens || []).length, main_assets: ['SOL', ...tokens].slice(0, 5) };
}

function generateSummary(archetype, patterns, txAnalysis) {
  const topPattern = patterns[0]?.pattern?.toLowerCase() || 'diverse on-chain activity';
  const txCount = txAnalysis.txCount;
  const summaries = {
    'DeFi Strategist': `Sophisticated DeFi participant with ${txCount} recent transactions, primarily engaged in ${topPattern}.`,
    'Momentum Surfer': `Active trader following market momentum with ${txCount} recent transactions, emphasizing ${topPattern}.`,
    'Diamond Hands': `Long-term conviction holder with ${txCount} recent transactions, showing patterns of ${topPattern}.`,
    'High-Frequency Trader': `High-activity wallet with ${txCount} recent transactions, specializing in ${topPattern}.`,
    'Yield Farmer': `Yield-optimized strategy across ${txCount} recent transactions, focused on ${topPattern}.`,
    'NFT Collector': `NFT-focused wallet with ${txCount} recent transactions, primarily engaged in ${topPattern}.`,
    'Active Distributor': `Active token distributor with ${txCount} recent transactions, primarily engaged in ${topPattern}.`
  };
  return summaries[archetype] || `Diverse on-chain activity across ${txCount} recent transactions, showing ${topPattern}.`;
}

async function analyzeWallet(address) {
  if (!isValidSolanaAddress(address)) throw new Error('Invalid Solana address format');
  if (!HELIUS_API_KEY) throw new Error('HELIUS_API_KEY is not set in environment variables');

  const [transactions, balances] = await Promise.all([fetchTransactions(address), fetchBalances(address)]);

  const txAnalysis = analyzeTransactions(transactions);
  const archetype = classifyArchetype(txAnalysis, balances);
  const patterns = detectPatterns(txAnalysis);
  const riskScore = calculateRiskScore(txAnalysis, balances);
  const portfolio = buildPortfolioOverview(balances);
  const summary = generateSummary(archetype, patterns, txAnalysis);

  return { wallet_address: address, chain: SUPPORTED_CHAIN, version: API_VERSION, archetype, risk_score: riskScore, behavior_patterns: patterns, portfolio_overview: portfolio, summary, last_updated: new Date().toISOString() };
}

module.exports = { analyzeWallet, isValidSolanaAddress };
