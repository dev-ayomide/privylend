'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrivyLendAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { AssetType, ASSET_CONFIG, Loan } from '@/lib/types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

interface PendingLoan {
  id: string;
  borrower: string;
  requestedAsset: string;
  requestedAmount: number;
  collateralValue: number;
  collateralId: string;
  interestRate: number;
  ltv: number;
}

interface ImpactData {
  loanId: string;
  loanAsset: string;
  currentLTV: number;
  newLTV: number;
  newCollateralValue: number;
  statusChange: string;
}

export default function AdminPage() {
  const [api, setApi] = useState<PrivyLendAPI | null>(null);
  const [pendingLoans, setPendingLoans] = useState<PendingLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Price Oracle state
  const [selectedAsset, setSelectedAsset] = useState<AssetType>('cBTC');
  const [newPrice, setNewPrice] = useState<string>('60000');
  const [impacts, setImpacts] = useState<ImpactData[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Initialize API with Pool Party credentials
  useEffect(() => {
    const poolParty = process.env.NEXT_PUBLIC_POOL_PARTY;
    const poolToken = process.env.NEXT_PUBLIC_POOL_TOKEN;

    if (poolParty && poolToken) {
      const poolAPI = new PrivyLendAPI(poolParty, poolToken);
      setApi(poolAPI);
    } else {
      setError('Pool party credentials not configured. Add NEXT_PUBLIC_POOL_TOKEN to .env.local');
      setLoading(false);
    }
  }, []);

  const fetchPendingLoans = async () => {
    if (!api) return;

    try {
      setLoading(true);
      // Get pending loan requests where this pool is the lendingPool
      const loans = await api.getPendingLoanRequests();

      // Transform to PendingLoan interface
      const pending = loans.map(loan => ({
        id: loan.id,
        borrower: 'Borrower', // We'd need to add this to the loan data
        requestedAsset: loan.loanAsset,
        requestedAmount: loan.principal,
        collateralValue: loan.collateralValue,
        collateralId: loan.collateralId,
        interestRate: loan.interestRate,
        ltv: loan.currentLTV,
      }));

      setPendingLoans(pending);
    } catch (err) {
      console.error('Error fetching pending loans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setLoading(false);
      return;
    }

    if (!api) {
      // Keep loading true until API is initialized
      return;
    }

    // Initial fetch
    fetchPendingLoans();

    // Refresh every 10 seconds
    const interval = setInterval(fetchPendingLoans, 10000);
    return () => clearInterval(interval);
  }, [api]);

  const handleApproveLoan = async (loanId: string) => {
    if (USE_MOCK_DATA || !api) {
      setSuccess('Loan approved (demo mode)');
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await api.approveLoan(loanId);
      setSuccess('Loan approved successfully!');
      await fetchPendingLoans();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve loan');
    }
  };

  // Price Oracle: Calculate impact of price change on all loans
  const handleCalculateImpact = async () => {
    if (USE_MOCK_DATA || !api) {
      setError('Price oracle not available in demo mode');
      return;
    }

    setCalculating(true);
    setError(null);

    try {
      const price = parseFloat(newPrice);
      if (isNaN(price) || price <= 0) {
        setError('Please enter a valid price greater than 0');
        return;
      }

      // Fetch all active loans
      const loans = await api.getAllActiveLoans();

      if (loans.length === 0) {
        setError('No active loans to update');
        setImpacts([]);
        return;
      }

      // Get current price from ASSET_CONFIG
      const currentPrice = ASSET_CONFIG[selectedAsset].price;

      // Calculate impact for each loan
      const impactData: ImpactData[] = loans.map(loan => {
        // Calculate new collateral value based on price change
        const priceRatio = price / currentPrice;
        const newCollateralValue = loan.collateralValue * priceRatio;
        const newLTV = loan.outstandingBalance / newCollateralValue;

        // Determine status change
        let newStatus = 'Active';
        if (newLTV >= 0.85) newStatus = 'Liquidating';
        else if (newLTV >= 0.80) newStatus = 'MarginCall';

        return {
          loanId: loan.id,
          loanAsset: loan.loanAsset,
          currentLTV: loan.currentLTV,
          newLTV,
          newCollateralValue,
          statusChange: loan.status === newStatus ? 'No change' : `${loan.status} → ${newStatus}`
        };
      });

      setImpacts(impactData);
      setSuccess(`Calculated impact for ${impactData.length} loans`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate impact');
    } finally {
      setCalculating(false);
    }
  };

  // Price Oracle: Update a specific loan's collateral value
  const handleUpdateLoan = async (loanId: string, newCollateralValue: number) => {
    if (USE_MOCK_DATA || !api) {
      return;
    }

    setUpdating(loanId);
    setError(null);

    try {
      await api.updateLoanCollateralValue(loanId, newCollateralValue);
      setSuccess(`Loan ${loanId.slice(0, 8)}... updated successfully!`);

      // Recalculate impacts to show updated state
      await handleCalculateImpact();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan');
    } finally {
      setUpdating(null);
    }
  };

  const getLTVColor = (ltv: number) => {
    if (ltv >= 0.85) return 'text-red-600 font-bold';
    if (ltv >= 0.80) return 'text-amber-600 font-bold';
    if (ltv >= 0.70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Pool Admin Dashboard</h1>
        <p className="text-slate-600">
          Manage loan requests and monitor pool operations
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-700 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Price Oracle Simulator</CardTitle>
          <CardDescription>
            Simulate market price changes and update loan LTV ratios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Prices Display */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Current Asset Prices</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">cBTC</p>
                <p className="text-lg font-bold text-slate-900 font-numeric">{formatCurrency(ASSET_CONFIG.cBTC.price)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">cETH</p>
                <p className="text-lg font-bold text-slate-900 font-numeric">{formatCurrency(ASSET_CONFIG.cETH.price)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">USDC</p>
                <p className="text-lg font-bold text-slate-900 font-numeric">{formatCurrency(ASSET_CONFIG.USDC.price)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">USDT</p>
                <p className="text-lg font-bold text-slate-900 font-numeric">{formatCurrency(ASSET_CONFIG.USDT.price)}</p>
              </div>
            </div>
          </div>

          {/* Price Update Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset" className="text-sm font-medium text-slate-700">Select Asset</Label>
              <select
                id="asset"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value as AssetType)}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cBTC">cBTC - Canton Bitcoin</option>
                <option value="cETH">cETH - Canton Ethereum</option>
                <option value="USDC">USDC - USD Coin</option>
                <option value="USDT">USDT - Tether</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPrice" className="text-sm font-medium text-slate-700">New Price ($)</Label>
              <Input
                id="newPrice"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new price"
                min="0"
                step="0.01"
                className="font-numeric"
              />
            </div>
          </div>

          <div>
            <Button
              onClick={handleCalculateImpact}
              disabled={calculating || !api}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {calculating ? 'Calculating...' : 'Calculate Impact on Loans'}
            </Button>
            {parseFloat(newPrice) > 0 && ASSET_CONFIG[selectedAsset] && (
              <p className="text-sm text-slate-600 mt-2">
                Price change: {((parseFloat(newPrice) / ASSET_CONFIG[selectedAsset].price - 1) * 100).toFixed(1)}%
              </p>
            )}
          </div>

          {/* Impact Results Table */}
          {impacts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Impact on Active Loans ({impacts.length} loans)</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Loan ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Asset</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Current LTV</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase">New LTV</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status Change</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impacts.map((impact) => (
                      <tr key={impact.loanId} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-mono text-slate-900">{impact.loanId.slice(0, 12)}...</td>
                        <td className="py-3 px-4 text-sm text-slate-900">{impact.loanAsset}</td>
                        <td className="py-3 px-4 text-sm text-right font-numeric">
                          <span className={getLTVColor(impact.currentLTV)}>
                            {(impact.currentLTV * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-numeric">
                          <span className={getLTVColor(impact.newLTV)}>
                            {(impact.newLTV * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {impact.statusChange === 'No change' ? (
                            <span className="text-slate-500">{impact.statusChange}</span>
                          ) : (
                            <span className="font-semibold text-amber-600">{impact.statusChange}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateLoan(impact.loanId, impact.newCollateralValue)}
                            disabled={updating === impact.loanId || !api}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                          >
                            {updating === impact.loanId ? 'Updating...' : 'Update'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Pending Loan Requests</CardTitle>
          <CardDescription>
            Review and approve loan applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-600">Loading pending loans...</p>
            </div>
          ) : pendingLoans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No pending loan requests</p>
              <p className="text-sm text-slate-500 mt-2">Approved loans will appear in the active loans section</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Borrower</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Asset</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Collateral</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">LTV</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Rate</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLoans.map((loan) => (
                    <tr key={loan.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 text-sm text-slate-900">{loan.borrower}</td>
                      <td className="py-4 px-4 text-sm text-slate-900">{loan.requestedAsset}</td>
                      <td className="py-4 px-4 text-sm text-slate-900 text-right font-numeric">
                        {formatCurrency(loan.requestedAmount)}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-900 text-right font-numeric">
                        {formatCurrency(loan.collateralValue)}
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <span className={`font-numeric font-semibold ${
                          loan.ltv <= 0.60 ? 'text-green-600' :
                          loan.ltv <= 0.70 ? 'text-blue-600' :
                          'text-amber-600'
                        }`}>
                          {(loan.ltv * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-900 text-right font-numeric">
                        {(loan.interestRate * 100).toFixed(1)}%
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          onClick={() => handleApproveLoan(loan.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5"
                        >
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Approval Criteria</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• LTV must be ≤ 70%</li>
                <li>• Collateral must be unlocked</li>
                <li>• Valid collateral contract</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">After Approval</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Collateral auto-locks</li>
                <li>• ActiveLoan contract created</li>
                <li>• Funds transferred to borrower</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Risk Monitoring</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Margin call at 80% LTV</li>
                <li>• Liquidation at 85% LTV</li>
                <li>• Automatic LTV tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
