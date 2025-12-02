# PrivyLend

**Privacy-Preserving Lending Protocol on Canton Network**

PrivyLend is a production-ready decentralized lending platform that enables compliant lending while preserving user privacy through Canton Network's privacy architecture.

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## 📋 Overview

PrivyLend solves the critical challenge of balancing user privacy with regulatory compliance in DeFi lending. Using Canton's privacy features, we enable:

- **Borrowers**: Prove creditworthiness without revealing identity
- **Lenders**: Verify collateral exists without seeing specific asset details  
- **Regulators**: Audit compliance without accessing all transaction details

## 🏗️ Architecture

### Smart Contracts (Daml)
- **CollateralAccount**: Manages collateral deposits with privacy
- **LoanRequest**: Handles loan applications with 70% LTV validation
- **ActiveLoan**: Tracks active loans and repayments
- **LendingPool**: Supports multi-investor lending

### Frontend (Next.js)
- **Dashboard**: Financial overview and statistics
- **Deposit**: Add collateral to the protocol
- **Borrow**: Request loans against collateral
- **My Loans**: Manage active loans and repayments

## 🔒 Privacy Features

PrivyLend uses Canton's observer pattern to enable selective disclosure:

- Collateral details are encrypted and only visible to authorized parties
- Lenders see collateral value, not asset specifics
- Regulators can audit without accessing personal data
- All privacy guarantees enforced at the smart contract level

## 🛠️ Technology Stack

- **Blockchain**: Canton Network
- **Smart Contracts**: Daml 2.10.2
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Testing**: Comprehensive Daml test suite

## 📖 Documentation

See [DEMO_GUIDE.md](./DEMO_GUIDE.md) for a complete walkthrough of the application features and demo script.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.
