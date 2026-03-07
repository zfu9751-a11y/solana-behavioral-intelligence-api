# Architecture

## Overview

Strata BI is a stateless API service that fetches real-time on-chain data, runs it through a behavioral analysis engine, and returns structured wallet profiles as JSON.

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│         (Developer / dApp / Dashboard / SDK)            │
└─────────────────────────┬───────────────────────────────┘
                          │  GET /api/v1/solana/wallet/:address/analysis
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Strata BI API                         │
│                                                         │
│   ┌─────────────┐    ┌──────────────┐    ┌──────────┐  │
│   │   Router    │───▶│  Controller  │───▶│ Analysis │  │
│   │             │    │              │    │ Service  │  │
│   └─────────────┘    └──────────────┘    └────┬─────┘  │
│                                               │        │
└───────────────────────────────────────────────┼────────┘
                                                │
                          ┌─────────────────────┤
                          │                     │
                          ▼                     ▼
           ┌──────────────────────┐  ┌──────────────────────┐
           │   Helius API         │  │   Helius API         │
           │   /transactions      │  │   /balances          │
           └──────────────────────┘  └──────────────────────┘
                          │                     │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │    Solana Chain      │
                          └─────────────────────┘
```

---

## Request Flow

```
1. Client sends GET /api/v1/solana/wallet/:address/analysis

2. Router → Controller
   - Validate wallet address format (base58, 32–44 chars)
   - Return 400 if invalid

3. Controller → Analysis Service
   - Fetch transactions + balances from Helius in parallel (Promise.all)

4. Analysis Engine runs 5 steps:
   a. analyzeTransactions()   — classify tx types, calculate frequency
   b. classifyArchetype()     — assign one of 6 wallet archetypes
   c. detectPatterns()        — score behavioral signals with confidence
   d. calculateRiskScore()    — compute 0–100 risk score
   e. buildPortfolioOverview() — SOL balance + token holdings

5. Return structured JSON response to client
```

---

## Component Breakdown

### API Layer (`api/`)

| File | Responsibility |
|------|---------------|
| `server.js` | Express app setup, middleware, port config |
| `routes/analysisRoutes.js` | Route definitions |
| `controllers/analysisController.js` | Request handling, input validation, error responses |
| `services/behaviorAnalysisService.js` | Core analysis logic + Helius data fetching |

### SDK (`sdk/`)

| File | Responsibility |
|------|---------------|
| `index.js` | JavaScript client wrapper for the API |

---

## Analysis Engine

### Archetype Classification

Six archetypes are assigned based on transaction type distribution and frequency:

| Archetype | Primary Signal |
|-----------|---------------|
| NFT Collector | NFT_SALE / NFT_MINT / NFT_BID > 40% of txs |
| Yield Farmer | STAKE_SOL / UNSTAKE_SOL > 30% of txs |
| DeFi Strategist | ADD_LIQUIDITY / REMOVE_LIQUIDITY > 20% of txs |
| High-Frequency Trader | Avg time between txs < 1 hour |
| Momentum Surfer | SWAP > 50% of txs |
| Diamond Hands | None of the above — low frequency holder |

### Risk Scoring (0–100)

| Factor | Impact |
|--------|--------|
| Avg time between txs < 1hr | +25 |
| Avg time between txs < 6hr | +10 |
| Tx count > 50 | +20 |
| Tx count > 20 | +10 |
| Swap ratio × 25 | +0 to +25 |
| Staking ratio × 10 | −0 to −10 |

### Behavioral Patterns

Patterns are detected from transaction type counts and assigned confidence scores (0–0.99) based on their proportion of total activity. Top 4 patterns by confidence are returned.

---

## Data Sources

| Source | Endpoint | Data |
|--------|----------|------|
| Helius | `/v0/addresses/:address/transactions` | Last 100 transactions with type classification |
| Helius | `/v0/addresses/:address/balances` | SOL balance + SPL token holdings |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 16 |
| Framework | Express.js |
| Data | Helius API |
| SDK | Vanilla JavaScript (ESM) |
| Config | dotenv |

---

## Planned Additions (Phase 2)

- Frontend demo layer (wallet connect + visual profile display)
- Caching layer to reduce Helius API calls for repeated addresses
- Batch endpoint for analyzing multiple wallets in one request
- Historical analysis using extended transaction lookback
