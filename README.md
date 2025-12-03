# PrivyLend
**Privacy-Preserving Lending Protocol on Canton Network**

PrivyLend is a decentralized lending platform that enables institutional-grade borrowing and lending while maintaining complete privacy through Canton Network's privacy architecture.

🎥 **[Watch Demo Video](https://www.loom.com/share/10f60d8f0f7f4a568fec9a9cbc522c5d)** | 🌐 **[Live Demo](https://privylend.vercel.app)**

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/dev-ayomide/privylend.git
cd privylend

# Install and run frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Overview

PrivyLend solves the critical challenge of balancing user privacy with regulatory compliance in DeFi lending. Traditional DeFi protocols expose all transaction details publicly, preventing institutional adoption. Using Canton's privacy features, PrivyLend enables:

- **Borrowers**: Prove creditworthiness without revealing identity
- **Lenders**: Verify collateral exists without seeing specific asset details  
- **Regulators**: Audit compliance without accessing all transaction details
- **Institutions**: Access DeFi yields while maintaining confidentiality

---

## 🏗️ Architecture

### Smart Contracts (Daml)
- **CollateralAccount**: Manages collateral deposits with privacy preservation
- **LoanRequest**: Handles loan applications with 70% LTV validation
- **ActiveLoan**: Tracks active loans with automated repayment logic
- **LendingPool**: Supports multi-investor lending pools

### Frontend (Next.js)
- **Dashboard**: Real-time financial overview and statistics
- **Deposit**: Secure collateral deposits with multiple asset types
- **Borrow**: Request loans against collateral with instant calculations
- **My Loans**: Manage active loans, repayments, and loan history

---

## 🔒 Privacy Features

PrivyLend leverages Canton's observer pattern for selective disclosure:

- ✅ Collateral details encrypted and visible only to authorized parties
- ✅ Lenders see collateral value without asset-specific information
- ✅ Regulators can audit compliance without accessing personal data
- ✅ Zero-knowledge proofs verify collateral sufficiency privately
- ✅ All privacy guarantees enforced at the smart contract level

---

## 🛠️ Technology Stack

- **Blockchain**: Canton Network
- **Smart Contracts**: Daml 2.10.2
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Testing**: Comprehensive Daml Script test suite

---

## 🎯 Canton Construct Ideathon 2024

**Challenge Track**: Lending, Borrowing & Yield Applications

**Key Innovation**: Privacy-preserving institutional lending using Canton's selective disclosure architecture

**Problem Solved**: Opens $10T+ institutional capital to DeFi by maintaining transaction confidentiality

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Real-time overview of collateral, loans, and available credit*
<img width="1877" height="868" alt="image" src="https://github.com/user-attachments/assets/9c5d2250-351d-4601-9049-53e5f17dc0d7" />


---

## 🔗 Links

- **Live Demo**: [https://privylend.vercel.app](https://privylend.vercel.app)
- **Demo Video**: [Watch on Loom](https://www.loom.com/share/10f60d8f0f7f4a568fec9a9cbc522c5d)
- **GitHub**: [https://github.com/dev-ayomide/privylend](https://github.com/dev-ayomide/privylend)

---

*Built with ❤️ on Canton Network*
