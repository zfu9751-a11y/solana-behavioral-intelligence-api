# Solana Behavioral Intelligence API

A lightweight on-chain behavioral analytics infrastructure layer for Solana wallets.

---

## Overview

Solana Behavioral Intelligence API converts raw on-chain wallet activity into structured behavioral intelligence signals.

Instead of manually parsing transaction logs and token balances, developers can access a standardized endpoint that returns:

- Behavioral archetype classification
- Quantitative risk score (0–100)
- Portfolio overview summary
- Behavioral pattern indicators
- Machine-generated intelligence summary

This project is built API-first with modular service architecture and versioned endpoints.

---

## API Endpoint

GET /api/v1/solana/wallet/{address}/analysis

---

## Example Request

```bash
curl http://localhost:3000/api/v1/solana/wallet/ExampleAddress/analysis
```

---

## Example Response

```json
{
  "wallet_address": "ExampleAddress",
  "chain": "solana",
  "version": "v1",
  "archetype": "Active DeFi Trader",
  "risk_score": 62,
  "behavior_patterns": [
    {
      "pattern": "High-frequency activity",
      "confidence": 0.81
    }
  ],
  "portfolio_overview": {
    "total_value": 12840,
    "main_assets": ["SOL", "USDC", "JUP"]
  },
  "summary": "Behavior suggests consistent DeFi interaction and moderate portfolio diversification.",
  "last_updated": "2026-03-01T12:00:00Z"
}
```

---

## Architecture

- API-first design
- Versioned endpoint structure (/api/v1/)
- Controller / Service modular architecture
- Upgrade-ready for live Solana RPC integration

---

## Project Structure

```
├── api/
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   └── services/
├── docs/
└── sdk/
```

---

## Current Status

The current implementation validates:

- Behavioral scoring framework
- Archetype classification logic
- Standardized JSON response schema
- Versioned REST API architecture

Live Solana RPC integration (Helius or direct RPC) is planned under grant milestone development.

---

## Roadmap (6 Months)

Month 1–2:
- Integrate live Solana RPC
- Replace deterministic modeling with real on-chain data

Month 3–4:
- Behavioral scoring calibration
- Risk model refinement

Month 5–6:
- API stabilization
- Documentation improvements
- SDK enhancement

---

## Vision

To establish a reusable behavioral intelligence infrastructure layer for the Solana ecosystem.

---

## License

MIT
