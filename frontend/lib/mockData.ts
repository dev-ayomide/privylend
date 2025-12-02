import { CollateralAccount, Loan } from './types';

export const mockCollateral: CollateralAccount[] = [
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

export const mockLoans: Loan[] = [
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

export const LTV_RATIO = 0.7;
export const MIN_DEPOSIT = 1000;
