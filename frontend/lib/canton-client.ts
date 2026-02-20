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

// Fetch loan requests for user (as borrower)
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

// Fetch loan requests for pool (as lendingPool/observer)
export async function getLoanRequestsForPool(poolParty: string, token?: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:Loan:LoanRequest`],
        query: { lendingPool: poolParty }
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying loan requests for pool:', error);
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

// Fetch lending pools
export async function getLendingPools() {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:LendingPool:Pool`],
        query: {}
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying lending pools:', error);
    return [];
  }
}

// Withdraw collateral (archives the contract - only for unlocked collateral)
export async function withdrawCollateral(collateralId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Collateral:CollateralAccount`,
        contractId: collateralId,
        choice: 'Withdraw',
        argument: {}
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error withdrawing collateral:', error);
    throw error;
  }
}

// Unlock collateral (converts locked collateral back to available)
export async function unlockCollateral(collateralId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Collateral:CollateralAccount`,
        contractId: collateralId,
        choice: 'UnlockCollateral',
        argument: {}
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error unlocking collateral:', error);
    throw error;
  }
}

// Lock collateral (when loan is approved)
export async function lockCollateral(collateralId: string, loanId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Collateral:CollateralAccount`,
        contractId: collateralId,
        choice: 'LockCollateral',
        argument: {
          loanId: loanId
        }
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error locking collateral:', error);
    throw error;
  }
}

// Update collateral price (for LTV recalculation)
export async function updateCollateralPrice(collateralId: string, newPrice: number) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Collateral:CollateralAccount`,
        contractId: collateralId,
        choice: 'UpdatePrice',
        argument: {
          newPrice: newPrice.toString()
        }
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error updating collateral price:', error);
    throw error;
  }
}

// Update collateral value on loan (for LTV monitoring)
export async function updateLoanCollateralValue(loanId: string, newCollateralValue: number, token?: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Loan:ActiveLoan`,
        contractId: loanId,
        choice: 'UpdateCollateralValue',
        argument: {
          newCollateralValue: newCollateralValue.toString()
        }
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error updating loan collateral value:', error);
    throw error;
  }
}

// Trigger liquidation
export async function triggerLiquidation(loanId: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Loan:ActiveLoan`,
        contractId: loanId,
        choice: 'TriggerLiquidation',
        argument: {}
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error triggering liquidation:', error);
    throw error;
  }
}

// Approve loan request (pool operator only)
export async function approveLoan(loanRequestId: string, token?: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/exercise`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateId: `${PACKAGE_ID}:Loan:LoanRequest`,
        contractId: loanRequestId,
        choice: 'ApproveLoan',
        argument: {}
      }),
    });

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.errors ? error.errors.join(', ') : 'Exercise failed');
    }

    return await result.json();
  } catch (error) {
    console.error('Error approving loan:', error);
    throw error;
  }
}

// Query all collateral accounts (admin view - no owner filter)
export async function getAllCollateral(token?: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:Collateral:CollateralAccount`],
        query: {} // No filter - get all collateral
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying all collateral:', error);
    return [];
  }
}

// Query all active loans (admin view - no borrower filter)
export async function getAllActiveLoans(token?: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_LEDGER_URL}?endpoint=/v1/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateIds: [`${PACKAGE_ID}:Loan:ActiveLoan`],
        query: {} // No filter - get all active loans
      }),
    });

    if (!result.ok) {
      throw new Error(`Query failed: ${result.status}`);
    }

    const data = await result.json();
    return data.result || [];
  } catch (error) {
    console.error('Error querying all active loans:', error);
    return [];
  }
}
