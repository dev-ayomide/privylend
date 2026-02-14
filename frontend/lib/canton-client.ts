import { AssetType, ASSET_CONFIG } from './types';

// Using direct fetch calls to Canton JSON API via Next.js proxy
// No Ledger instance needed
// Canton JSON API requires fully qualified templateId: "packageId:module:entity"

const PACKAGE_ID = '62cadf4e59b40316f2db227451d3372d780ff562659bb9b4101528d04621e9e3';

// Fetch user collateral
export async function getCollateral(userId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:Collateral:CollateralAccount`],
        query: { owner: userId }
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying collateral:', error);
    return [];
  }
}

// Create collateral deposit
export async function depositCollateral(
  userId: string,
  assetType: AssetType,
  quantity: number,
  price: number
) {
  const haircut = ASSET_CONFIG[assetType].haircut;
  const effectiveValue = quantity * price * (1 - haircut);

  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Collateral:CollateralAccount`,
        payload: {
          owner: userId,
          assetType,
          quantity: quantity.toString(),
          marketPrice: price.toString(),
          haircut: haircut.toString(),
          effectiveValue: effectiveValue.toString(),
          isLocked: false,
          depositTimestamp: new Date().toISOString()
        }
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Create failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error creating collateral:', error);
    throw error;
  }
}

// Fetch loan requests for user
export async function getLoanRequests(userId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:Loan:LoanRequest`],
        query: { borrower: userId }
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying loan requests:', error);
    return [];
  }
}

// Fetch active loans for user
export async function getActiveLoansFromCanton(userId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:Loan:ActiveLoan`],
        query: { borrower: userId }
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying active loans:', error);
    return [];
  }
}

// Request loan
export async function requestLoan(
  userId: string,
  collateralId: string,
  requestedAsset: AssetType,
  requestedAmount: number,
  collateralValue: number
) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Loan:LoanRequest`,
        payload: {
          borrower: userId,
          lendingPool: process.env.NEXT_PUBLIC_POOL_PARTY || 'PrivyLendPool',
          collateralId,
          requestedAsset,
          requestedAmount: requestedAmount.toString(),
          collateralValue: collateralValue.toString(),
          interestRate: '0.08',
          status: 'Pending'
        }
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Create failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error creating loan request:', error);
    throw error;
  }
}

// Make payment
export async function makePayment(
  loanId: string,
  amount: number
) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Loan:ActiveLoan`,
        contractId: loanId,
        choice: 'MakePayment',
        argument: {
          paymentAmount: amount.toString()
        }
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error making payment:', error);
    throw error;
  }
}
