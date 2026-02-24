# Solana Behavioral Intelligence API Documentation

## Overview

Infrastructure layer providing structured behavioral analytics for Solana wallets.

## Endpoint

```
GET /api/v1/solana/wallet/{address}/analysis
```

## Parameters

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| address   | string | Yes      | Solana wallet address |

## Example Request

```bash
curl http://localhost:3001/api/v1/solana/wallet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/analysis
```

## JavaScript Example

```javascript
fetch('http://localhost:3001/api/v1/solana/wallet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/analysis')
  .then(response => response.json())
  .then(data => console.log(data));
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
    {
      "pattern": "High-frequency trading",
      "confidence": 0.82
    },
    {
      "pattern": "Yield farming",
      "confidence": 0.76
    }
  ],
  "portfolio_overview": {
    "total_value": 45678,
    "main_assets": ["SOL", "USDC", "JUP"]
  },
  "summary": "This wallet demonstrates sophisticated DeFi behavior with a focus on high-frequency trading.",
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

## Response Fields

| Field               | Type   | Description                     |
|---------------------|--------|---------------------------------|
| wallet_address      | string | Solana wallet address           |
| chain               | string | Blockchain identifier           |
| version             | string | API version                     |
| archetype           | string | Trader archetype classification |
| risk_score          | number | Risk score (0-100)              |
| behavior_patterns   | array  | Detected behavior patterns      |
| portfolio_overview  | object | Portfolio summary               |
| summary             | string | AI-generated behavioral summary |
| last_updated        | string | ISO timestamp                   |

## Error Responses

### 400 - Bad Request

```json
{
  "error": "Invalid address format",
  "message": "Please provide a valid Solana wallet address"
}
```

### 500 - Internal Server Error

```json
{
  "error": "Analysis failed",
  "message": "Error description"
}
```

## CORS

Cross-Origin Resource Sharing is enabled for all origins.

---

*Version: v1*  
*Chain: Solana*
