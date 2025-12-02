export type AssetType = 'Cryptocurrency' | 'Real Estate' | 'Securities' | 'Commodities';

export type CollateralStatus = 'Available' | 'Locked';

export type LoanStatus = 'Active' | 'Due Soon' | 'Repaid' | 'Defaulted';

export interface CollateralAccount {
  id: string;
  assetType: AssetType;
  value: number;
  status: CollateralStatus;
  lockDate?: string;
}

export interface Loan {
  id: string;
  collateralId: string;
  principal: number;
  interestRate: number;
  termDays: number;
  startDate: string;
  dueDate: string;
  status: LoanStatus;
  totalOwed: number;
}
