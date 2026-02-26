# PrivyLend

**Privacy-Preserving Institutional Lending on Canton Network**

PrivyLend is a decentralized lending protocol where borrowers post collateral that is cryptographically invisible to the lending pool -- enforced by Daml's signatory model, not access control or UI restrictions. Built for the Canton Construct Ideathon 2025.

**Demo Video** | **GitHub**: [github.com/dev-ayomide/privylend](https://github.com/dev-ayomide/privylend)

---

## The Problem

$10T+ of institutional capital is locked out of DeFi because public blockchains can't keep a secret. On Ethereum, every collateral deposit is visible to everyone -- a hedge fund posting $50M in Bitcoin instantly signals its position to competitors and front-runners. This is a structural incompatibility with how institutions operate.

## The Solution

PrivyLend uses Canton's sub-transaction privacy so the lending pool can approve loans **without ever seeing the borrower's collateral**. The pool sees only: borrower ID, LTV ratio, and requested amount. The collateral contract itself returns `CONTRACT_NOT_FOUND` when queried by the pool -- this is privacy by architecture, not by permission.

---

## Quick Start

### Prerequisites
- [Daml SDK 2.10.2](https://docs.daml.com/getting-started/installation.html)
- [Node.js 18+](https://nodejs.org/)

### Run Locally (Full Canton Integration)

```bash
# Terminal 1: Start Canton sandbox + JSON API
cd daml/privylend-contracts
daml start

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 -- the app connects to Canton automatically.

### Run Smart Contract Tests Only

```bash
cd daml/privylend-contracts
daml build
daml test
```

The test script covers the full lifecycle: pool creation, collateral deposit, loan request, approval, price drop, margin call, and repayment.

### Run in Demo Mode (No Canton Required)

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `frontend/.env.local` to use localStorage-based mock data for UI exploration.

---

## Architecture

### Smart Contracts (Daml)

Located in `daml/privylend-contracts/daml/`:

| Contract | Choices | Purpose |
|----------|---------|---------|
| **Asset.daml** | Transfer, Split | Canton-native asset token management |
| **Collateral.daml** | LockCollateral, UnlockCollateral, UpdatePrice, Withdraw | Collateral deposits with haircuts, lock/unlock, price updates |
| **Loan.daml** | ApproveLoan, RejectLoan, CancelRequest, MakePayment, UpdateCollateralValue, TriggerLiquidation | Full loan lifecycle from request to repayment or liquidation |
| **LendingPool.daml** | Fund tracking, approvals | Multi-asset lending pool management |
| **Test.daml** | -- | End-to-end Daml Script test covering full loan lifecycle |

**4 contracts, 12+ on-chain choices, 0 mock data in production mode.**

### Frontend (Next.js)

| Page | Function |
|------|----------|
| **Dashboard** (`/`) | Portfolio overview -- collateral balances, active loans, LTV monitoring, withdraw/unlock |
| **Deposit** (`/deposit`) | Deposit cBTC, cETH, USDC, or USDT as collateral with on-chain haircut |
| **Borrow** (`/borrow`) | Request loans against deposited collateral with 70% max LTV |
| **My Loans** (`/loans`) | Monitor active loans, LTV risk levels, make repayments, cancel requests |
| **Admin** (`/admin`) | Pool operator dashboard -- approve/reject loans, simulate price changes, trigger liquidations |

### Integration Layer

- **Next.js API Proxy** (`app/api/canton/route.ts`) -- Routes browser requests to Canton JSON API (avoids CORS)
- **Canton Client** (`lib/canton-client.ts`) -- Direct fetch calls to Canton JSON API v1
- **API Layer** (`lib/api.ts`) -- Transforms Canton contract data to frontend types

---

## Privacy Model

PrivyLend uses Canton's signatory/observer model for selective disclosure:

| What | Borrower Sees | Pool Operator Sees |
|------|--------------|-------------------|
| Collateral asset type | Yes | **No** |
| Collateral quantity | Yes | **No** |
| Collateral market value | Yes | **No** |
| Loan request amount | Yes | Yes |
| LTV ratio | Yes | Yes |
| Loan status | Yes | Yes |

**How it works**: The `CollateralAccount` contract has `signatory owner` and `observer owner` -- the pool party is never added as an observer, making the contract structurally invisible to them. The pool approves loans based on the LTV ratio embedded in the `LoanRequest`, never the underlying collateral.

---

## Loan Lifecycle

```
1. DEPOSIT    Borrower deposits cBTC/cETH/USDC/USDT → CollateralAccount created
2. LOCK       Borrower locks collateral (auto-triggered before loan request)
3. REQUEST    Borrower submits LoanRequest with LTV ≤ 70%
4. APPROVE    Pool operator approves → ActiveLoan contract created
   REJECT     Pool operator rejects → borrower cancels → collateral auto-unlocks
5. MONITOR    Price oracle updates → LTV recalculated → margin call at 80%, liquidation at 85%
6. REPAY      Borrower pays with interest (8% APR, time-based) → collateral auto-unlocks
   LIQUIDATE  LTV ≥ 85% → pool triggers liquidation → loan marked Liquidated
```

## Supported Assets & Risk Parameters

| Asset | Haircut | Max LTV | Margin Call | Liquidation |
|-------|---------|---------|-------------|-------------|
| cBTC (Canton Bitcoin) | 20% | 70% | 80% | 85% |
| cETH (Canton Ethereum) | 20% | 70% | 80% | 85% |
| USDC (USD Coin) | 5% | 70% | 80% | 85% |
| USDT (Tether) | 5% | 70% | 80% | 85% |

**Interest Rate**: Fixed 8% APR, calculated on-chain at repayment time.

---

## Technology Stack

- **Blockchain**: Canton Network (sandbox)
- **Smart Contracts**: Daml 2.10.2 (LF target 1.15)
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: Canton JSON API v1 via Next.js API proxy
- **Authentication**: HS256 JWT tokens for Canton sandbox

---

## Testing & Verification

### Daml Script Tests

```bash
cd daml/privylend-contracts
daml test
```

The test script (`Test.daml`) covers:
1. Create lending pool with initial funds
2. Alice deposits 1 cBTC as collateral ($48,000 effective value after 20% haircut)
3. Alice requests $30,000 USDC loan (62.5% LTV -- within 70% limit)
4. Pool approves the loan, ActiveLoan contract created
5. Market crash simulated -- cBTC price drops, LTV rises to 83.3% (margin call zone)
6. Alice repays $5,000 to bring LTV back to safe zone (69.4%)

### Manual Testing Flow

1. Start Canton: `cd daml/privylend-contracts && daml start`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Deposit collateral on the Deposit page
5. Request a loan on the Borrow page
6. Switch to Admin page (`/admin`) to approve the loan
7. Simulate a price drop on Admin page to see margin call
8. Return to My Loans page to repay

---

## Project Structure

```
privylend/
├── daml/privylend-contracts/
│   ├── daml/
│   │   ├── Asset.daml          # Asset token management
│   │   ├── Collateral.daml     # Collateral with lock/unlock/price
│   │   ├── Loan.daml           # Loan request, approval, repayment, liquidation
│   │   ├── LendingPool.daml    # Multi-asset pool management
│   │   └── Test.daml           # End-to-end test script
│   └── daml.yaml               # Daml project config
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Dashboard
│   │   ├── deposit/page.tsx    # Collateral deposit
│   │   ├── borrow/page.tsx     # Loan requests
│   │   ├── loans/page.tsx      # Loan management & repayment
│   │   ├── admin/page.tsx      # Pool operator dashboard
│   │   └── api/canton/route.ts # Canton JSON API proxy
│   ├── lib/
│   │   ├── canton-client.ts    # Canton API integration
│   │   ├── api.ts              # Business logic layer
│   │   ├── types.ts            # TypeScript types & asset config
│   │   └── mockData.ts         # localStorage fallback
│   └── components/             # Reusable UI components
└── README.md
```

---

## Canton Construct Ideathon 2025

**Challenge Track**: Lending, Borrowing & Yield Applications

**Builder**: Taiwo Ayomide (Team AyPrivy) -- Solo builder

**Key Innovation**: Privacy-preserving lending using Canton's sub-transaction privacy, where collateral details are structurally invisible to the lending pool -- not hidden behind permissions, but cryptographically inaccessible by design.

**What changed from Phase 1 to Phase 2**:
- Phase 1 (Ideathon Prototype): UI mockups, conceptual Daml design -- Top 10 Finalist
- Phase 2 (Mentorship Build): 4 deployed Daml contracts, 12+ on-chain choices, zero mock data, full loan lifecycle on Canton, admin dashboard with price oracle simulation

---

## Note for Judges

PrivyLend runs on Canton sandbox, which requires the Daml SDK installed locally. Canton does not have a public testnet -- it is designed for permissioned institutional networks.

**To verify the smart contracts without running the full app:**
```bash
cd daml/privylend-contracts
daml build && daml test
```

**To run the full application:**
```bash
# Terminal 1
cd daml/privylend-contracts && daml start

# Terminal 2
cd frontend && npm install && npm run dev
```

The demo video shows every transaction executing live on Canton sandbox with real Daml smart contract calls.

---

## License

MIT License
