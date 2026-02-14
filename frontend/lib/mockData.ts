import { CollateralAccount, Loan } from './types';

// Load from localStorage or use defaults
export const loadCollateral = (): CollateralAccount[] => {
  if (typeof window === 'undefined') return getDefaultCollateral();
  const stored = localStorage.getItem('privylend_collateral');
  return stored ? JSON.parse(stored) : getDefaultCollateral();
};

export const loadLoans = (): Loan[] => {
  if (typeof window === 'undefined') return getDefaultLoans();
  const stored = localStorage.getItem('privylend_loans');
  return stored ? JSON.parse(stored) : getDefaultLoans();
};

// Save to localStorage
export const saveCollateral = (collateral: CollateralAccount[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('privylend_collateral', JSON.stringify(collateral));
  }
};

export const saveLoans = (loans: Loan[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('privylend_loans', JSON.stringify(loans));
  }
};

// Default data - Canton-native assets
const getDefaultCollateral = (): CollateralAccount[] => [
  {
    id: '1',
    assetType: 'cBTC',
    quantity: 1.0,
    marketPrice: 60000,
    haircut: 0.20,
    effectiveValue: 48000,   // 60000 * 1.0 * 0.80
    status: 'Available',
    depositTimestamp: '2026-01-15T00:00:00Z',
  },
  {
    id: '2',
    assetType: 'cETH',
    quantity: 10.0,
    marketPrice: 3000,
    haircut: 0.20,
    effectiveValue: 24000,   // 3000 * 10 * 0.80
    status: 'Locked',
    depositTimestamp: '2026-01-10T00:00:00Z',
  },
  {
    id: '3',
    assetType: 'USDC',
    quantity: 100000,
    marketPrice: 1,
    haircut: 0.05,
    effectiveValue: 95000,   // 100000 * 1 * 0.95
    status: 'Available',
    depositTimestamp: '2026-01-20T00:00:00Z',
  },
];

const getDefaultLoans = (): Loan[] => [
  {
    id: '1',
    collateralId: '2',
    loanAsset: 'USDC',
    principal: 15000,
    outstandingBalance: 15000,
    collateralValue: 24000,
    currentLTV: 0.625,        // 15000 / 24000
    interestRate: 0.08,
    startDate: '2026-01-10',
    dueDate: '2026-02-09',
    status: 'Active',
    totalOwed: 15100,         // principal + ~30 days interest
    marginCallThreshold: 0.80,
    liquidationThreshold: 0.85,
  },
];

// Export mutable arrays that get updated
export let mockCollateral: CollateralAccount[] = loadCollateral();
export let mockLoans: Loan[] = loadLoans();

// Helper to add new collateral
export const addCollateral = (collateral: Omit<CollateralAccount, 'id'>) => {
  const newId = String(Math.max(...mockCollateral.map(c => parseInt(c.id)), 0) + 1);
  const newCollateral = { ...collateral, id: newId };
  mockCollateral = [...mockCollateral, newCollateral];
  saveCollateral(mockCollateral);
  return newCollateral;
};

// Helper to add new loan
export const addLoan = (loan: Omit<Loan, 'id'>) => {
  const newId = String(Math.max(...mockLoans.map(l => parseInt(l.id)), 0) + 1);
  const newLoan = { ...loan, id: newId };
  mockLoans = [...mockLoans, newLoan];
  saveLoans(mockLoans);
  return newLoan;
};

// Reset to defaults
export const resetToDefaults = () => {
  mockCollateral = getDefaultCollateral();
  mockLoans = getDefaultLoans();
  saveCollateral(mockCollateral);
  saveLoans(mockLoans);
};

export const LTV_RATIO = 0.7;
