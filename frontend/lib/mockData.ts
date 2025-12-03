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

// Default data
const getDefaultCollateral = (): CollateralAccount[] => [
  {
    id: '1',
    assetType: 'Cryptocurrency',
    value: 150000,
    status: 'Available',
  },
  {
    id: '2',
    assetType: 'Real Estate',
    value: 250000,
    status: 'Locked',
    lockDate: '2024-12-01',
  },
  {
    id: '3',
    assetType: 'Securities',
    value: 130000,
    status: 'Available',
  },
];

const getDefaultLoans = (): Loan[] => [
  {
    id: '1',
    collateralId: '2',
    principal: 100000,
    interestRate: 5,
    termDays: 365,
    startDate: '2024-12-01',
    dueDate: '2025-12-01',
    status: 'Active',
    totalOwed: 105000,
  },
  {
    id: '2',
    collateralId: '2',
    principal: 180000,
    interestRate: 5,
    termDays: 730,
    startDate: '2024-05-01',
    dueDate: '2026-05-01',
    status: 'Active',
    totalOwed: 189000,
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
export const MIN_DEPOSIT = 1000;
