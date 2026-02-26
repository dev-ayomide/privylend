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

  // Fetch pending loan requests for pool (admin view)
  async getPendingLoanRequests(): Promise<Loan[]> {
    try {
      const loanRequests = await CantonClient.getLoanRequestsForPool(this.party, this.token);

      // Transform LoanRequest contracts - filter to only Pending (exclude Rejected)
      return loanRequests
        .filter((c: any) => c.payload.status === 'Pending')
        .map((c: any) => ({
          id: c.contractId,
          borrower: c.payload.borrower,
          collateralId: c.payload.collateralId,
          loanAsset: c.payload.requestedAsset as AssetType,
          principal: parseFloat(c.payload.requestedAmount),
          outstandingBalance: parseFloat(c.payload.requestedAmount),
          collateralValue: parseFloat(c.payload.collateralValue),
          currentLTV: parseFloat(c.payload.requestedAmount) / parseFloat(c.payload.collateralValue),
          interestRate: parseFloat(c.payload.interestRate),
          startDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          status: 'Pending' as const,
          totalOwed: parseFloat(c.payload.requestedAmount) * 1.08,
          marginCallThreshold: 0.80,
          liquidationThreshold: 0.85,
        }));
    } catch (error) {
      console.error('Error fetching pending loan requests:', error);
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

      // Transform LoanRequest contracts (Pending or Rejected)
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
        status: (c.payload.status === 'Rejected' ? 'Rejected' : 'Pending') as Loan['status'],
        totalOwed: parseFloat(c.payload.requestedAmount) * 1.08,
        marginCallThreshold: 0.80,
        liquidationThreshold: 0.85,
      }));

      // Transform ActiveLoan contracts
      const active: Loan[] = activeLoans.map((c: any) => ({
        id: c.contractId,
        collateralId: c.payload.collateralId || '',  // Now tracked in contract
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
    try {
      const contracts = await CantonClient.getLendingPools();
      // Transform Canton Pool contracts to our interface
      return contracts.map((c: any) => ({
        id: c.contractId,
        owner: c.payload.poolOperator,
        name: 'PrivyLend Pool',
        availableFunds: parseFloat(c.payload.availableUSDC) + parseFloat(c.payload.availableCBTC),
      }));
    } catch (error) {
      console.error('Error fetching lending pools:', error);
      return [];
    }
  }

  // Withdraw collateral
  async withdrawCollateral(collateralId: string): Promise<void> {
    try {
      await CantonClient.withdrawCollateral(collateralId);
      console.log('Collateral withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing collateral:', error);
      throw error;
    }
  }

  // Unlock collateral (after loan is repaid)
  async unlockCollateral(collateralId: string): Promise<void> {
    try {
      await CantonClient.unlockCollateral(collateralId);
      console.log('Collateral unlocked successfully');
    } catch (error) {
      console.error('Error unlocking collateral:', error);
      throw error;
    }
  }

  // Lock collateral (before requesting loan) - returns new locked contract ID
  async lockCollateral(collateralId: string, loanId: string): Promise<string> {
    try {
      const result = await CantonClient.lockCollateral(collateralId, loanId, this.token);
      // Canton exercise returns new contract ID in exerciseResult
      const newContractId = result?.result?.exerciseResult || result?.exerciseResult;
      console.log('Collateral locked successfully, new contract ID:', newContractId);
      return newContractId;
    } catch (error) {
      console.error('Error locking collateral:', error);
      throw error;
    }
  }

  // Update collateral price
  async updateCollateralPrice(collateralId: string, newPrice: number): Promise<void> {
    try {
      await CantonClient.updateCollateralPrice(collateralId, newPrice);
      console.log('Collateral price updated successfully');
    } catch (error) {
      console.error('Error updating collateral price:', error);
      throw error;
    }
  }

  // Update loan collateral value (for LTV monitoring)
  async updateLoanCollateralValue(loanId: string, newCollateralValue: number): Promise<void> {
    try {
      await CantonClient.updateLoanCollateralValue(loanId, newCollateralValue, this.token);
      console.log('Loan collateral value updated successfully');
    } catch (error) {
      console.error('Error updating loan collateral value:', error);
      throw error;
    }
  }

  // Trigger liquidation
  async triggerLiquidation(loanId: string): Promise<void> {
    try {
      await CantonClient.triggerLiquidation(loanId);
      console.log('Liquidation triggered successfully');
    } catch (error) {
      console.error('Error triggering liquidation:', error);
      throw error;
    }
  }

  // Reject loan request (pool operator only)
  async rejectLoan(loanRequestId: string): Promise<void> {
    try {
      await CantonClient.rejectLoan(loanRequestId, this.token);
      console.log('Loan rejected successfully');
    } catch (error) {
      console.error('Error rejecting loan:', error);
      throw error;
    }
  }

  // Cancel loan request (borrower only - unlocks collateral)
  async cancelLoanRequest(loanRequestId: string): Promise<void> {
    try {
      await CantonClient.cancelLoanRequest(loanRequestId);
      console.log('Loan request cancelled, collateral unlocked');
    } catch (error) {
      console.error('Error cancelling loan request:', error);
      throw error;
    }
  }

  // Approve loan request (pool operator only)
  async approveLoan(loanRequestId: string): Promise<string> {
    try {
      const activeLoanId = await CantonClient.approveLoan(loanRequestId, this.token);
      console.log('Loan approved successfully, new ActiveLoan ID:', activeLoanId);
      return activeLoanId;
    } catch (error) {
      console.error('Error approving loan:', error);
      throw error;
    }
  }

  // Get all collateral accounts (admin only - for price oracle)
  async getAllCollateralAccounts(): Promise<CollateralAccount[]> {
    try {
      const contracts = await CantonClient.getAllCollateral(this.token);
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
      console.error('Error fetching all collateral accounts:', error);
      return [];
    }
  }

  // Get all active loans (admin only - for price oracle)
  async getAllActiveLoans(): Promise<Loan[]> {
    try {
      const activeLoans = await CantonClient.getAllActiveLoans(this.token);

      // Transform ActiveLoan contracts
      return activeLoans.map((c: any) => ({
        id: c.contractId,
        borrower: c.payload.borrower,
        collateralId: c.payload.collateralId || '',
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
    } catch (error) {
      console.error('Error fetching all active loans:', error);
      return [];
    }
  }
}
