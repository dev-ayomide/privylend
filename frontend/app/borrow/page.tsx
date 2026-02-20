'use client';

import { useState, useEffect } from 'react';
import { LoanForm } from '@/components/LoanForm';
import { usePrivyLend } from '@/hooks/usePrivyLend';
import { loadCollateral } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CollateralAccount, ASSET_CONFIG, INTEREST_RATE } from '@/lib/types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

export default function BorrowPage() {
  const [selectedCollateral, setSelectedCollateral] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCollateral, setDisplayCollateral] = useState<CollateralAccount[]>([]);

  const { collateral, api } = usePrivyLend();

  useEffect(() => {
    if (USE_MOCK_DATA || !api) {
      setDisplayCollateral(loadCollateral());
    } else {
      setDisplayCollateral(collateral);
    }
  }, [USE_MOCK_DATA, api, collateral]);

  const availableCollateral = displayCollateral.filter(c => c.status === 'Available');
  const selected = availableCollateral.find(c => c.id === selectedCollateral);

  const handleLoanRequest = async (data: { amount: number; termDays: number; interestRate: number }) => {
    if (USE_MOCK_DATA || !api) {
      if (!selectedCollateral || !selected) {
        setError('Please select collateral');
        setTimeout(() => setError(null), 3000);
        return;
      }

      const { addLoan } = await import('@/lib/mockData');

      const startDate = new Date();
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + data.termDays);

      const currentLTV = data.amount / selected.effectiveValue;

      addLoan({
        collateralId: selectedCollateral,
        loanAsset: 'USDC',
        principal: data.amount,
        outstandingBalance: data.amount,
        collateralValue: selected.effectiveValue,
        currentLTV,
        interestRate: INTEREST_RATE,
        startDate: startDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Active',
        totalOwed: data.amount * (1 + INTEREST_RATE * (data.termDays / 365)),
        marginCallThreshold: 0.80,
        liquidationThreshold: 0.85,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.href = '/loans';
      }, 2000);
      return;
    }

    if (!selectedCollateral || !selected) {
      setError('Please select collateral');
      return;
    }

    setError(null);
    setSuccess(false);

    try {
      // Step 1: Lock the collateral first (using collateralId as temporary loanId)
      // This prevents borrower from withdrawing collateral while loan is pending/active
      await api.lockCollateral(selectedCollateral, selectedCollateral);

      // Step 2: Create the loan request
      await api.requestLoan(
        selectedCollateral,
        data.amount,
        selected.effectiveValue,
        'USDC',
        INTEREST_RATE
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request loan');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Request a Loan</h1>
        <p className="text-slate-600">
          Borrow against your Canton-native collateral with privacy
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
              Loan request submitted successfully! Waiting for pool approval.
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
                  Deposit cBTC, cETH, USDC, or USDT first to request a loan
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {availableCollateral.map((col) => {
                const config = ASSET_CONFIG[col.assetType];
                return (
                  <Card
                    key={col.id}
                    className={`border cursor-pointer transition-all ${
                      selectedCollateral === col.id
                        ? 'border-blue-500 shadow-md bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedCollateral(col.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">
                          {col.assetType} - {config.name}
                        </h3>
                        <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md border border-green-200">
                          Available
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">
                          {col.quantity} {col.assetType} @ {formatCurrency(col.marketPrice)}
                        </p>
                        <p className="text-xl font-bold text-slate-900 font-numeric">
                          {formatCurrency(col.effectiveValue)}
                        </p>
                        <p className="text-xs text-slate-500">
                          After {col.haircut * 100}% haircut | Max loan: <span className="text-blue-600 font-medium font-numeric">{formatCurrency(col.effectiveValue * 0.7)}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Loan Details</h2>
            <p className="text-sm text-slate-600">Configure your loan parameters</p>
          </div>

          {selected ? (
            <LoanForm
              collateralValue={selected.effectiveValue}
              onSubmit={handleLoanRequest}
            />
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
                Choose from cBTC, cETH, USDC, USDT
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">2</div>
              <h3 className="font-semibold text-sm text-slate-900">Request Loan</h3>
              <p className="text-xs text-slate-600">
                Up to 70% LTV at 8% APR
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">3</div>
              <h3 className="font-semibold text-sm text-slate-900">Get Approved</h3>
              <p className="text-xs text-slate-600">
                Pool validates and approves
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 font-numeric">4</div>
              <h3 className="font-semibold text-sm text-slate-900">Receive Funds</h3>
              <p className="text-xs text-slate-600">
                Privately on Canton Network
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
