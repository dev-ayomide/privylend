'use client';

import { useState, useEffect } from 'react';
import { LoanForm } from '@/components/LoanForm';
import { usePrivyLend } from '@/hooks/usePrivyLend';
import { loadCollateral } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Party } from '@daml/types';
import { CollateralAccount } from '@/lib/types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

export default function BorrowPage() {
  const [selectedCollateral, setSelectedCollateral] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lenders, setLenders] = useState<Array<{ id: string; owner: Party; name: string; availableFunds: number }>>([]);
  const [selectedLender, setSelectedLender] = useState<Party | null>(null);
  const [displayCollateral, setDisplayCollateral] = useState<CollateralAccount[]>([]);
  
  const { collateral, api, refreshData } = usePrivyLend();
  
  // Load data on mount
  useEffect(() => {
    if (USE_MOCK_DATA || !api) {
      setDisplayCollateral(loadCollateral());
    } else {
      setDisplayCollateral(collateral);
    }
  }, [USE_MOCK_DATA, api, collateral]);
  const availableCollateral = displayCollateral.filter(c => c.status === 'Available');
  const selected = availableCollateral.find(c => c.id === selectedCollateral);

  useEffect(() => {
    if (api && !USE_MOCK_DATA) {
      api.getLendingPools().then(setLenders).catch(console.error);
      // Default to first lender if available
      api.getLendingPools().then((pools) => {
        if (pools.length > 0) {
          setSelectedLender(pools[0].owner);
        }
      });
    }
  }, [api]);

  const handleLoanRequest = async (data: { amount: number; termDays: number; interestRate: number }) => {
    if (USE_MOCK_DATA || !api) {
      // Mock mode - actually add to localStorage
      if (!selectedCollateral) {
        setError('Please select collateral');
        setTimeout(() => setError(null), 3000);
        return;
      }

      const { addLoan } = await import('@/lib/mockData');
      const selectedCol = availableCollateral.find(c => c.id === selectedCollateral);
      
      if (!selectedCol) {
        setError('Invalid collateral selected');
        return;
      }

      // Calculate due date
      const startDate = new Date();
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + data.termDays);

      // Add loan with the selected collateral
      addLoan({
        collateralId: selectedCollateral,
        principal: data.amount,
        interestRate: data.interestRate,
        termDays: data.termDays,
        startDate: startDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Active',
        totalOwed: data.amount * (1 + data.interestRate / 100),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.href = '/loans'; // Navigate to loans page to see the new loan
      }, 2000);
      return;
    }

    if (!selectedCollateral) {
      setError('Please select collateral');
      return;
    }

    if (!selectedLender) {
      setError('Please select a lender');
      return;
    }

    setError(null);
    setSuccess(false);

    try {
      await api.requestLoan(
        selectedCollateral,
        data.amount,
        data.termDays,
        selectedLender,
        data.interestRate
      );
      setSuccess(true);
      await refreshData();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request loan');
      console.error('Loan request error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Request a Loan</h1>
        <p className="text-slate-600">
          Borrow against your collateral with privacy and transparency
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 font-medium text-center flex items-center justify-center gap-2">
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
            <p className="text-green-700 font-medium text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Loan request submitted successfully! Waiting for lender approval.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Select Collateral</h2>
            <p className="text-sm text-slate-600">Choose an asset to use as collateral</p>
          </div>
          
          {availableCollateral.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600 mb-2">No available collateral</p>
                <p className="text-sm text-slate-500">
                  Deposit collateral first to request a loan
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {availableCollateral.map((collateral) => (
                <Card
                  key={collateral.id}
                  className={`border cursor-pointer transition-all ${
                    selectedCollateral === collateral.id
                      ? 'border-blue-500 shadow-md bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedCollateral(collateral.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">
                        {collateral.assetType}
                      </h3>
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md border border-green-200">
                        Available
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-slate-900 font-numeric">
                        {formatCurrency(collateral.value)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Max loan: <span className="text-blue-600 font-medium font-numeric">{formatCurrency(collateral.value * 0.7)}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Loan Details</h2>
            <p className="text-sm text-slate-600">Configure your loan parameters</p>
          </div>
          
          {selected ? (
            <>
              {!USE_MOCK_DATA && lenders.length > 0 && (
                <Card className="border-slate-200 mb-4">
                  <CardContent className="pt-6">
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Select Lender</Label>
                    <select
                      value={selectedLender || ''}
                      onChange={(e) => setSelectedLender(e.target.value as Party)}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {lenders.map((lender) => (
                        <option key={lender.id} value={lender.owner}>
                          {lender.name} ({formatCurrency(lender.availableFunds)} available)
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>
              )}
              <LoanForm
                collateralValue={selected.value}
                onSubmit={handleLoanRequest}
              />
            </>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600">
                  Select collateral to continue
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">How Borrowing Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">1</div>
              <h3 className="font-semibold text-sm text-slate-900">Select Collateral</h3>
              <p className="text-xs text-slate-600">
                Choose available collateral
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">2</div>
              <h3 className="font-semibold text-sm text-slate-900">Request Loan</h3>
              <p className="text-xs text-slate-600">
                Specify amount and terms
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">3</div>
              <h3 className="font-semibold text-sm text-slate-900">Get Approved</h3>
              <p className="text-xs text-slate-600">
                Lender reviews your request
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">4</div>
              <h3 className="font-semibold text-sm text-slate-900">Receive Funds</h3>
              <p className="text-xs text-slate-600">
                Funds transferred instantly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

