# PrivyLend

**Privacy-Preserving Lending Protocol on Canton Network**

PrivyLend is a decentralized lending platform that enables compliant lending while preserving user privacy through Canton Network's sub-transaction privacy architecture.

## Quick Start

### Prerequisites
- [Daml SDK 2.10.2](https://docs.daml.com/getting-started/installation.html)
- [Node.js 18+](https://nodejs.org/)

### Run with Canton (Production Mode)

```bash
# Terminal 1: Start Canton sandbox
cd daml/privylend-contracts
daml start

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 - the app connects to Canton automatically.

### Run in Demo Mode (No Canton Required)

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `frontend/.env.local` to use localStorage-based mock data.

## Architecture

### Smart Contracts (Daml)

Located in `daml/privylend-contracts/daml/`:

| Contract | Purpose |
|----------|---------|
| **Asset.daml** | Canton-native asset token management |
| **Collateral.daml** | Collateral deposits with haircuts and lock/unlock |
| **Loan.daml** | Loan request, approval, repayment, and liquidation |
| **LendingPool.daml** | Multi-asset lending pool management |
| **Test.daml** | End-to-end test script covering the full loan lifecycle |

### Frontend (Next.js 16)

| Page | Function |
|------|----------|
| **Dashboard** | Portfolio overview with real-time Canton data |
| **Deposit** | Deposit cBTC, cETH, USDC, or USDT as collateral |
| **Borrow** | Request loans against deposited collateral |
| **My Loans** | Monitor active loans, LTV risk, and make repayments |

### Integration Layer

- **Next.js API Proxy** (`app/api/canton/route.ts`) - Routes requests to Canton JSON API
- **Canton Client** (`lib/canton-client.ts`) - Direct fetch calls to Canton JSON API v1
- **API Layer** (`lib/api.ts`) - Transforms Canton contracts to frontend types

## Privacy Features

PrivyLend uses Canton's signatory/observer model for selective disclosure:

- **Collateral contracts** - Only the owner (signatory) sees deposit details
- **Loan requests** - Only the borrower (signatory) and lending pool (observer) see terms
- **Active loans** - Dual signatory (borrower + lender) ensures both parties consent
- All privacy guarantees are enforced at the smart contract level

## Supported Assets & Risk Parameters

| Asset | Haircut | Max LTV | Margin Call | Liquidation |
|-------|---------|---------|-------------|-------------|
| cBTC (Canton Bitcoin) | 20% | 70% | 80% | 85% |
| cETH (Canton Ethereum) | 20% | 70% | 80% | 85% |
| USDC (USD Coin) | 5% | 70% | 80% | 85% |
| USDT (Tether) | 5% | 70% | 80% | 85% |

**Interest Rate**: Fixed 8% APR

## Running Daml Tests

```bash
cd daml/privylend-contracts
daml build
daml test
```

The test script (`Test.daml`) covers the complete lifecycle:
1. Create lending pool
2. Alice deposits 1 cBTC as collateral ($48,000 effective value)
3. Alice requests $30,000 USDC loan (62.5% LTV)
4. Pool approves the loan
5. Price drop triggers margin call (83.3% LTV)
6. Alice repays $5,000 to return to safe zone (69.4% LTV)

## Technology Stack

- **Blockchain**: Canton Network
- **Smart Contracts**: Daml 2.10.2 (LF target 1.15)
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: Canton JSON API v1 via Next.js proxy

## Canton Construct Ideathon 2025

**Challenge Track**: Lending, Borrowing & Yield Applications

**Key Innovation**: Privacy-preserving lending using Canton's sub-transaction privacy model, where collateral and loan details are only visible to authorized participants - not the entire network.

## License

MIT License
