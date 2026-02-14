export type AssetType = 'cBTC' | 'cETH' | 'USDC' | 'USDT';

export type CollateralStatus = 'Available' | 'Locked';

export type LoanStatus = 'Active' | 'MarginCall' | 'Liquidating' | 'Repaid' | 'Due Soon';

export interface CollateralAccount {
  id: string;
  assetType: AssetType;
  quantity: number;
  marketPrice: number;
  haircut: number;           // 0.20 for cBTC/cETH, 0.05 for USDC/USDT
  effectiveValue: number;    // quantity * marketPrice * (1 - haircut)
  status: CollateralStatus;
  depositTimestamp: string;
}

export interface Loan {
  id: string;
  collateralId: string;
  loanAsset: AssetType;
  principal: number;
  outstandingBalance: number;
  collateralValue: number;
  currentLTV: number;
  interestRate: number;       // 0.08 = 8%
  startDate: string;
  dueDate: string;
  status: LoanStatus;
  totalOwed: number;
  marginCallThreshold: number;   // 0.80
  liquidationThreshold: number;  // 0.85
}

// Asset configuration
export const ASSET_CONFIG: Record<AssetType, { name: string; price: number; haircut: number }> = {
  cBTC: { name: 'Canton Bitcoin', price: 60000, haircut: 0.20 },
  cETH: { name: 'Canton Ethereum', price: 3000, haircut: 0.20 },
  USDC: { name: 'USD Coin', price: 1, haircut: 0.05 },
  USDT: { name: 'Tether', price: 1, haircut: 0.05 },
};

export const LTV_MAX = 0.70;
export const MARGIN_CALL_THRESHOLD = 0.80;
export const LIQUIDATION_THRESHOLD = 0.85;
export const INTEREST_RATE = 0.08; // 8% APR
