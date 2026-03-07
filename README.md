# Strata BI — Solana Behavioral Intelligence API

> Turning raw on-chain data into structured wallet behavior profiles.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chain: Solana](https://img.shields.io/badge/Chain-Solana-9945FF)](https://solana.com)
[![Data: Helius](https://img.shields.io/badge/Data-Helius-orange)](https://helius.dev)
[![Status: MVP](https://img.shields.io/badge/Status-MVP-green)]()

---

## The Problem

Solana generates millions of transactions daily. But for developers building on this data, the raw output is nearly impossible to work with directly.

A wallet address tells you nothing by itself. Is it a bot? A long-term holder? A DeFi power user? An anomalous actor?

Most existing tools stop at displaying raw transaction lists. **Nobody is translating that data into structured behavioral intelligence.**

---

## What Strata BI Does

Strata BI is a behavioral intelligence layer for Solana wallets. It sits between raw chain data and the applications that need to understand user behavior.

You send a wallet address. We return a structured behavioral profile:

```bash
GET /api/v1/solana/wallet/:address/analysis
```

```json
{
  "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "chain": "solana",
  "archetype": "High-Frequency Trader",
  "risk_score": 77,
  "behavior_patterns": [
    { "pattern": "High-frequency trading", "confidence": 0.99 },
    { "pattern": "Token swapping", "confidence": 0.96 },
    { "pattern": "NFT trading", "confidence": 0.51 }
  ],
  "portfolio_overview": {
    "sol_balance": 49.71,
    "token_count": 60,
    "main_assets": ["SOL", "USDC", "JUP"]
  },
  "summary": "High-activity wallet with 100 recent transactions, specializing in high-frequency trading.",
  "last_updated": "2026-03-07T11:43:06.960Z"
}
```

All data is pulled in real-time from Helius and analyzed on-the-fly.

---

## Who Is This For

**Web3 developers** building risk systems, DeFi products, or NFT platforms who need wallet behavior signals without writing their own chain parsers.

**Data products** — wallet analytics dashboards, alpha tools, portfolio trackers — that need a structured behavioral data layer.

**Security and compliance** use cases: detecting bots, flagging high-risk addresses, identifying anomalous trading patterns.

---

## How It Works

```
Solana Chain
     ↓
Helius API  (transaction history + token balances)
     ↓
Strata BI Analysis Engine
  - Transaction type classification
  - Behavioral pattern detection
  - Archetype classification (6 types)
  - Risk scoring (0–100)
  - Portfolio overview
     ↓
Structured JSON response
```

**Wallet Archetypes:**
- `DeFi Strategist` — heavy liquidity and protocol interaction
- `High-Frequency Trader` — rapid, repeated transaction cadence
- `Momentum Surfer` — swap-dominant, trend-following behavior
- `Yield Farmer` — staking and yield-focused activity
- `NFT Collector` — NFT mint/sale/bid dominated
- `Diamond Hands` — low frequency, long-term holding pattern

---

## Quick Start

```bash
cd api
npm install
```

Create a `.env` file in the `api/` directory:

```
HELIUS_API_KEY=your_helius_api_key_here
```

Get your free API key at [helius.dev](https://helius.dev).

```bash
npm start
```

Test it:

```bash
curl http://localhost:3001/api/v1/solana/wallet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/analysis
```

---

## SDK

```javascript
import { analyzeWallet } from './sdk/index.js';

const result = await analyzeWallet('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
console.log(result.archetype);    // "High-Frequency Trader"
console.log(result.risk_score);   // 77
```

---

## Project Status

This is an early-stage MVP built to demonstrate the core analysis capability. The current version:

- ✅ Real-time data via Helius API
- ✅ Wallet archetype classification
- ✅ Behavioral pattern detection
- ✅ Risk scoring
- ✅ Portfolio overview
- ✅ REST API with error handling
- ✅ JavaScript SDK

Planned next milestones (see [ROADMAP](ROADMAP.md)):
- [ ] Wallet connection + frontend demo
- [ ] Expanded pattern library
- [ ] Historical trend analysis
- [ ] Multi-wallet batch API

---

## Why Solana

Solana's transaction throughput and rich on-chain data make it the ideal chain for behavioral analysis. The ecosystem is growing fast, but the tooling for making sense of that data at the behavioral layer is still largely missing. Strata BI is being built to fill that gap.

---

## Grant Context

This project is applying for a **Solana Foundation Small Grant** to complete the MVP phase, including:

- Core analysis engine improvements
- Public-facing demo interface
- Expanded archetype and pattern coverage
- Developer documentation

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed milestones and grant usage breakdown.

---

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for system design, request flow, and analysis engine details.

---

## API Documentation

Full API reference: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)

---

## License

MIT
