import { Party } from './daml';
import { CollateralAccount, Loan, AssetType } from './types';

// Map Daml AssetType to frontend AssetType
const mapAssetType = (damlType: string): AssetType => {
  // Daml enum values come as "Main:Crypto", "Main:RealEstate", etc.
  if (damlType.includes('Crypto')) return 'Cryptocurrency';
  if (damlType.includes('RealEstate')) return 'Real Estate';
  if (damlType.includes('Securities')) return 'Securities';
  if (damlType.includes('Commodities')) return 'Commodities';
  return 'Cryptocurrency'; // default
};

// Map frontend AssetType to Daml AssetType
const toDamlAssetType = (assetType: AssetType): string => {
  const mapping: Record<AssetType, string> = {
    'Cryptocurrency': 'Crypto',
    'Real Estate': 'RealEstate',
    'Securities': 'Securities',
    'Commodities': 'Commodities',
  };
  return `Main:${mapping[assetType]}`;
};

// Map Daml LoanStatus to frontend LoanStatus
const mapLoanStatus = (status: string, dueDate: Date): Loan['status'] => {
  if (status.includes('Repaid')) return 'Repaid';
  if (status.includes('Defaulted')) return 'Defaulted';
  if (status.includes('Active')) {
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 30 ? 'Due Soon' : 'Active';
  }
  return 'Active';
};

// Calculate total owed for a loan
const calculateTotalOwed = (
  principal: number,
  interestRate: number,
  startDate: Date,
  dueDate: Date
): number => {
  const daysDiff = Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const years = daysDiff / 365.0;
  const interest = principal * (interestRate / 100.0) * years;
  return principal + interest;
};

// Parse Daml Date string (format: "YYYY-MM-DD")
const parseDamlDate = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00Z');
};

export class PrivyLendAPI {
  private party: Party;

  constructor(party: Party, token?: string) {
    this.party = party;
  }

  // Fetch collateral accounts
  async getCollateralAccounts(): Promise<CollateralAccount[]> {
    // In demo mode, this would connect to Canton
    // For now, returning empty array as mock data is used
    return [];
  }

  // Fetch active loans
  async getActiveLoans(): Promise<Loan[]> {
    // In demo mode, this would connect to Canton
    // For now, returning empty array as mock data is used
    return [];
  }

  // Deposit collateral
  async depositCollateral(
    assetType: AssetType,
    amount: number
  ): Promise<string> {
    // In demo mode, this would create a contract on Canton
    return 'mock-contract-id';
  }

  // Request a loan
  async requestLoan(
    collateralId: string,
    amount: number,
    termDays: number,
    lender: Party,
    interestRate: number = 5.0
  ): Promise<string> {
    // In demo mode, this would create a loan request on Canton
    return 'mock-loan-id';
  }

  // Repay a loan
  async repayLoan(loanId: string, amount: number): Promise<void> {
    // In demo mode, this would exercise a choice on Canton
    return;
  }

  // Get available lenders (lending pools)
  async getLendingPools(): Promise<Array<{ id: string; owner: Party; name: string; availableFunds: number }>> {
    // In demo mode, this would query Canton
    return [];
  }

  // Withdraw collateral
  async withdrawCollateral(collateralId: string): Promise<void> {
    // In demo mode, this would exercise a choice on Canton
    return;
  }
}

