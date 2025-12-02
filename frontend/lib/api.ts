import { createLedger, Party } from './daml';
import { CollateralAccount, Loan, AssetType } from './types';
import { DamlLedger } from '@daml/ledger';

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
  private ledger: DamlLedger;
  private party: Party;

  constructor(party: Party, token?: string) {
    this.party = party;
    this.ledger = createLedger({ token });
  }

  // Fetch collateral accounts
  async getCollateralAccounts(): Promise<CollateralAccount[]> {
    try {
      const contracts = await this.ledger.query('Main:CollateralAccount', {
        owner: this.party,
      });

      return contracts.map((contract) => ({
        id: contract.contractId,
        assetType: mapAssetType(contract.payload.assetType),
        value: parseFloat(contract.payload.collateralAmount),
        status: contract.payload.isLocked ? 'Locked' : 'Available',
        lockDate: contract.payload.isLocked
          ? contract.payload.depositDate
          : undefined,
      }));
    } catch (error) {
      console.error('Error fetching collateral accounts:', error);
      return [];
    }
  }

  // Fetch active loans
  async getActiveLoans(): Promise<Loan[]> {
    try {
      const contracts = await this.ledger.query('Main:ActiveLoan', {
        borrower: this.party,
      });

      return contracts.map((contract) => {
        const startDate = parseDamlDate(contract.payload.startDate);
        const dueDate = parseDamlDate(contract.payload.dueDate);
        const principal = parseFloat(contract.payload.principal);
        const interestRate = parseFloat(contract.payload.interestRate);
        const daysDiff = Math.ceil(
          (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const totalOwed = calculateTotalOwed(
          principal,
          interestRate,
          startDate,
          dueDate
        );

        return {
          id: contract.contractId,
          collateralId: contract.payload.collateralId,
          principal,
          interestRate,
          termDays: daysDiff,
          startDate: startDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          status: mapLoanStatus(contract.payload.status, dueDate),
          totalOwed,
        };
      });
    } catch (error) {
      console.error('Error fetching active loans:', error);
      return [];
    }
  }

  // Deposit collateral
  async depositCollateral(
    assetType: AssetType,
    amount: number
  ): Promise<string> {
    const damlAssetType = toDamlAssetType(assetType);
    const today = new Date().toISOString().split('T')[0];

    const result = await this.ledger.create('Main:CollateralAccount', {
      owner: this.party,
      collateralAmount: amount.toString(),
      assetType: damlAssetType,
      isLocked: false,
      depositDate: today,
      observers: [],
    });

    return result.contractId;
  }

  // Request a loan
  async requestLoan(
    collateralId: string,
    amount: number,
    termDays: number,
    lender: Party,
    interestRate: number = 5.0
  ): Promise<string> {
    // First fetch collateral to get its value
    const collateral = await this.ledger.fetch(
      'Main:CollateralAccount',
      collateralId
    );

    if (!collateral) {
      throw new Error('Collateral not found');
    }

    const today = new Date().toISOString().split('T')[0];

    const result = await this.ledger.create('Main:LoanRequest', {
      borrower: this.party,
      lender,
      requestedAmount: amount.toString(),
      collateralId,
      collateralValue: collateral.payload.collateralAmount,
      interestRate: interestRate.toString(),
      loanTermDays: termDays,
      status: 'Main:Pending',
      requestDate: today,
      observers: [],
    });

    return result.contractId;
  }

  // Repay a loan
  async repayLoan(loanId: string, amount: number): Promise<void> {
    await this.ledger.exercise('Main:ActiveLoan', 'RepayLoan', loanId, {
      repaymentAmount: amount.toString(),
    });
  }

  // Get available lenders (lending pools)
  async getLendingPools(): Promise<Array<{ id: string; owner: Party; name: string; availableFunds: number }>> {
    try {
      const contracts = await this.ledger.query('Main:LendingPool', {});
      return contracts.map((contract) => ({
        id: contract.contractId,
        owner: contract.payload.poolOwner,
        name: contract.payload.poolName,
        availableFunds: parseFloat(contract.payload.availableFunds),
      }));
    } catch (error) {
      console.error('Error fetching lending pools:', error);
      return [];
    }
  }

  // Withdraw collateral
  async withdrawCollateral(collateralId: string): Promise<void> {
    await this.ledger.exercise(
      'Main:CollateralAccount',
      'WithdrawCollateral',
      collateralId,
      {}
    );
  }
}

