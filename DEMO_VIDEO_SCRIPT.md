# 🎥 PrivyLend Demo Video Script

## Duration: 2 Minutes

---

## Scene 1: Introduction (15 seconds)

**Screen**: Landing page at localhost:3000

**Script**:
> "Hi! I'm presenting PrivyLend - a privacy-preserving lending protocol built on Canton Network for the Lending, Borrowing & Yield Applications track.
>
> PrivyLend solves a critical problem: how do we enable DeFi lending while protecting user privacy AND maintaining regulatory compliance?"

---

## Scene 2: The Problem (15 seconds)

**Screen**: Show dashboard, highlight the problem

**Script**:
> "Traditional DeFi lending exposes ALL transaction details publicly. But borrowers need privacy, lenders need security, and regulators need compliance.
>
> Canton Network's privacy features make this possible."

---

## Scene 3: Key Innovation - Privacy (30 seconds)

**Screen**: Navigate to Deposit page, show code side-by-side

**Script**:
> "Here's how PrivyLend works using Canton's observer pattern.
>
> When I deposit $50,000 in cryptocurrency as collateral..."

**[Perform action: Fill form - $50,000, Cryptocurrency, click Deposit]**

> "...the collateral details are stored in a Daml smart contract with selective visibility.
>
> The contract uses Canton's observer mechanism - borrowers prove creditworthiness without revealing identity, lenders verify collateral exists without seeing specific details, and regulators can audit compliance without accessing everything."

**[Show Main.daml code - CollateralAccount template with observers]**

---

## Scene 4: Core Features - Borrowing (30 seconds)

**Screen**: Navigate to Borrow page

**Script**:
> "Now let me request a loan against my collateral.
>
> The smart contract enforces a 70% Loan-to-Value ratio for safety."

**[Perform action: Fill form]**
- Amount: $30,000 (70% of $50,000)
- Interest Rate: 8%
- Term: 90 days
- Click "Request Loan"

> "The LoanRequest contract validates the LTV ratio and creates a privacy-preserving loan request. Only authorized parties - the borrower, lender, and compliance observers - can see the full details."

---

## Scene 5: Loan Management (20 seconds)

**Screen**: Navigate to My Loans page

**Script**:
> "On the My Loans page, borrowers can track their active loans, see repayment schedules, and manage their positions.
>
> All loan data is stored on Canton Network with cryptographic privacy guarantees."

**[Show the loans table with active loans]**

---

## Scene 6: Smart Contract Architecture (20 seconds)

**Screen**: Show Main.daml file briefly

**Script**:
> "The magic happens in our Daml smart contracts. We have four main templates:
>
> - CollateralAccount - manages deposits with privacy
> - LoanRequest - handles applications with LTV validation
> - ActiveLoan - tracks loans and repayments
> - LendingPool - enables multi-investor lending
>
> Each uses Canton's privacy model to enforce selective disclosure."

---

## Scene 7: Why This Matters (20 seconds)

**Screen**: Back to Dashboard

**Script**:
> "PrivyLend demonstrates Canton Network's unique value proposition:
>
> TRUE privacy without sacrificing security or compliance. This isn't just hiding data - it's cryptographically enforced selective disclosure at the protocol level.
>
> This opens up institutional DeFi adoption by meeting both privacy and regulatory requirements."

---

## Scene 8: Closing (10 seconds)

**Screen**: Dashboard with stats visible

**Script**:
> "PrivyLend - privacy-preserving compliant lending on Canton Network.
>
> Built for Canton Construct Ideathon 2025. Thank you!"

---

## 📝 Recording Tips

### Setup Before Recording:
1. ✅ Run `npm run dev` in frontend folder
2. ✅ Open http://localhost:3000
3. ✅ Have Main.daml file open in VS Code (split screen)
4. ✅ Clear browser console
5. ✅ Zoom browser to 125% for better visibility
6. ✅ Test run through once

### Recording Tools:
- **OBS Studio** (free, best quality)
- **Loom** (easy, online, free tier)
- **Screen Recording** (Windows: Win+G, Mac: Cmd+Shift+5)

### What to Show:
1. ✅ Live UI interactions (deposit, borrow, loans)
2. ✅ Split screen showing code + UI
3. ✅ Highlight "Demo Mode" badge
4. ✅ Show Main.daml contract templates
5. ✅ Clear narration explaining privacy features

### What NOT to Do:
- ❌ Don't go over 2.5 minutes
- ❌ Don't show errors or setup issues
- ❌ Don't read code line by line
- ❌ Don't apologize or say "um"

### Key Points to Emphasize:
1. **Privacy-preserving** - Canton's observer pattern
2. **Regulatory compliance** - Selective disclosure
3. **Production-ready** - Real Daml contracts
4. **Innovative** - Solves real DeFi problem

---

## 🎬 Quick Script (30-second version if needed)

> "PrivyLend is a privacy-preserving lending protocol on Canton Network. Using Canton's observer pattern, borrowers can prove creditworthiness without revealing identity, lenders verify collateral without seeing details, and regulators audit without accessing everything. I'll deposit $50k collateral, request a $30k loan at 70% LTV, and show how our Daml smart contracts enforce privacy at the protocol level. This solves DeFi's privacy problem while maintaining compliance - perfect for institutional adoption. Thank you!"

---

## ✨ Polish & Upload

1. **Edit** (if needed): Trim dead space, add title card
2. **Upload**: YouTube (unlisted), Vimeo, or Loom
3. **Add to README**: Update the demo video link
4. **Test**: Watch it once to verify quality

Good luck! 🚀
