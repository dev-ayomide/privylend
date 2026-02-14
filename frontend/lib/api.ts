import { Party } from './daml';
import { CollateralAccount, Loan, AssetType, ASSET_CONFIG } from './types';
import * as CantonClient from './canton-client';

export class PrivyLendAPI {
  private party: Party;
  private token?: string;

  constructor(party: Party, token?: string) {
    this.party = party;
    this.token = token;
  }

  // Fetch collateral accounts
  async getCollateralAccounts(): Promise<CollateralAccount[]> {
    try {
      const contracts = await CantonClient.getCollateral(this.party);
      // Transform Canton contracts to our CollateralAccount type
      return contracts.map((c: any) => ({
        id: c.contractId,
        assetType: c.payload.assetType as AssetType,
        quantity: parseFloat(c.payload.quantity),
        marketPrice: parseFloat(c.payload.marketPrice),
        haircut: parseFloat(c.payload.haircut),
        effectiveValue: parseFloat(c.payload.effectiveValue),
        status: c.payload.isLocked ? 'Locked' : 'Available',
        depositTimestamp: c.payload.depositTimestamp,
      }));
    } catch (error) {
      console.error('Error fetching collateral accounts:', error);
      return [];
    }
  }

  // Fetch active loans (both LoanRequests and ActiveLoans from Canton)
  async getActiveLoans(): Promise<Loan[]> {
    try {
      const [loanRequests, activeLoans] = await Promise.all([
        CantonClient.getLoanRequests(this.party),
        CantonClient.getActiveLoansFromCanton(this.party),
      ]);

      // Transform LoanRequest contracts
      const requests: Loan[] = loanRequests.map((c: any) => ({
        id: c.contractId,
        collateralId: c.payload.collateralId,
        loanAsset: c.payload.requestedAsset as AssetType,
        principal: parseFloat(c.payload.requestedAmount),
        outstandingBalance: parseFloat(c.payload.requestedAmount),
        collateralValue: parseFloat(c.payload.collateralValue),
        currentLTV: parseFloat(c.payload.requestedAmount) / parseFloat(c.payload.collateralValue),
        interestRate: parseFloat(c.payload.interestRate),
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'Active' as const,
        totalOwed: parseFloat(c.payload.requestedAmount) * 1.08,
        marginCallThreshold: 0.80,
        liquidationThreshold: 0.85,
      }));

      // Transform ActiveLoan contracts
      const active: Loan[] = activeLoans.map((c: any) => ({
        id: c.contractId,
        collateralId: '',
        loanAsset: c.payload.loanAsset as AssetType,
        principal: parseFloat(c.payload.principal),
        outstandingBalance: parseFloat(c.payload.outstandingBalance),
        collateralValue: parseFloat(c.payload.collateralValue),
        currentLTV: parseFloat(c.payload.currentLTV),
        interestRate: parseFloat(c.payload.interestRate),
        startDate: c.payload.startDate,
        dueDate: c.payload.dueDate,
        status: c.payload.status as Loan['status'],
        totalOwed: parseFloat(c.payload.outstandingBalance),
        marginCallThreshold: parseFloat(c.payload.marginCallThreshold),
        liquidationThreshold: parseFloat(c.payload.liquidationThreshold),
      }));

      return [...requests, ...active];
    } catch (error) {
      console.error('Error fetching active loans:', error);
      return [];
    }
  }

  // Deposit collateral
  async depositCollateral(
    assetType: AssetType,
    quantity: number
  ): Promise<string> {
    try {
      const config = ASSET_CONFIG[assetType];
      const result = await CantonClient.depositCollateral(
        this.party,
        assetType,
        quantity,
        config.price
      );
      console.log('Collateral deposited successfully:', result);
      return result.contractId || 'created';
    } catch (error) {
      console.error('Error depositing collateral:', error);
      throw error;
    }
  }

  // Request a loan
  async requestLoan(
    collateralId: string,
    amount: number,
    collateralValue: number,
    requestedAsset: AssetType = 'USDC',
    interestRate: number = 0.08
  ): Promise<string> {
    try {
      const result = await CantonClient.requestLoan(
        this.party,
        collateralId,
        requestedAsset,
        amount,
        collateralValue
      );
      console.log('Loan requested successfully:', result);
      return result.contractId || 'created';
    } catch (error) {
      console.error('Error requesting loan:', error);
      throw error;
    }
  }

  // Repay a loan (make payment)
  async repayLoan(loanId: string, amount: number): Promise<void> {
    try {
      await CantonClient.makePayment(loanId, amount);
      console.log('Payment made successfully');
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }

  // Get available lending pools
  async getLendingPools(): Promise<Array<{ id: string; owner: Party; name: string; availableFunds: number }>> {
    // TODO: Implement Canton query for Pool contracts
    return [];
  }

  // Withdraw collateral
  async withdrawCollateral(collateralId: string): Promise<void> {
    // TODO: Implement Canton exercise for UnlockCollateral
    return;
  }
}
