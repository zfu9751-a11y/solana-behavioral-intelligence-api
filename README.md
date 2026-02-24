# Solana Behavioral Intelligence API

A lightweight infrastructure layer providing structured behavioral analytics for Solana wallets.

## Capabilities

- Wallet archetype classification
- Risk scoring
- AI-generated behavioral summaries
- Portfolio overview insights

## Endpoint

```
GET /api/v1/solana/wallet/{address}/analysis
```

## Quick Start

```bash
cd api
npm install
npm start
```

## Example

```bash
curl http://localhost:3001/api/v1/solana/wallet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/analysis
```

## Response

```json
{
  "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "chain": "solana",
  "version": "v1",
  "archetype": "DeFi Strategist",
  "risk_score": 72,
  "behavior_patterns": [
    { "pattern": "High-frequency trading", "confidence": 0.82 }
  ],
  "portfolio_overview": {
    "total_value": 45678,
    "main_assets": ["SOL", "USDC"]
  },
  "summary": "This wallet demonstrates sophisticated DeFi behavior...",
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

## SDK

```javascript
import { analyzeWallet } from './sdk/index.js';

const result = await analyzeWallet('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
```

## Purpose

Designed for ecosystem integration, protocol analytics, and developer access.
