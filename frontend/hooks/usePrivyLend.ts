import { useEffect, useState, useCallback } from 'react';
import { PrivyLendAPI } from '@/lib/api';
import { getCurrentParty, getAuthToken } from '@/lib/auth';
import { CollateralAccount, Loan } from '@/lib/types';
import { Party } from '@daml/types';

export function usePrivyLend() {
  const [api, setApi] = useState<PrivyLendAPI | null>(null);
  const [collateral, setCollateral] = useState<CollateralAccount[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [party, setParty] = useState<Party | null>(null);

  const refreshData = useCallback(async () => {
    if (!api) return;

    try {
      setError(null);
      const [collateralData, loansData] = await Promise.all([
        api.getCollateralAccounts(),
        api.getActiveLoans(),
      ]);
      setCollateral(collateralData);
      setLoans(loansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error refreshing data:', err);
    }
  }, [api]);

  useEffect(() => {
    const currentParty = getCurrentParty();
    const token = getAuthToken();

    if (!currentParty) {
      setLoading(false);
      setError('No party authenticated. Please log in.');
      return;
    }

    setParty(currentParty);
    const privyLendAPI = new PrivyLendAPI(currentParty, token || undefined);
    setApi(privyLendAPI);

    // Initial data fetch
    Promise.all([
      privyLendAPI.getCollateralAccounts(),
      privyLendAPI.getActiveLoans(),
    ])
      .then(([collateralData, loansData]) => {
        setCollateral(collateralData);
        setLoans(loansData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setLoading(false);
        console.error('Error initializing PrivyLend:', err);
      });
  }, []);

  return {
    api,
    collateral,
    loans,
    loading,
    error,
    party,
    refreshData,
  };
}

