'use client';

import { useState, useEffect } from 'react';
import { LoanTable } from '@/components/LoanTable';
import { usePrivyLend } from '@/hooks/usePrivyLend';
import { loadLoans } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loan } from '@/lib/types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

export default function LoansPage() {
  const { loans, api, refreshData } = usePrivyLend();
  const [repaymentSuccess, setRepaymentSuccess] = useState(false);
  const [fullRepaymentSuccess, setFullRepaymentSuccess] = useState(false);
  const [repaymentError, setRepaymentError] = useState<string | null>(null);
  const [displayLoans, setDisplayLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (USE_MOCK_DATA || !api) {
      setDisplayLoans(loadLoans());
    } else {
      setDisplayLoans(loans);
    }
  }, [USE_MOCK_DATA, api, loans]);

  const handleRepay = async (loanId: string, amount: number) => {
    if (USE_MOCK_DATA || !api) {
      setRepaymentSuccess(true);
      setTimeout(() => setRepaymentSuccess(false), 3000);
      return;
    }

    setRepaymentError(null);
    setRepaymentSuccess(false);
    setFullRepaymentSuccess(false);

    try {
      // Find the loan to check if full repayment
      const loan = displayLoans.find(l => l.id === loanId);
      const isFullRepayment = loan && amount >= loan.outstandingBalance;

      // Make payment (automatically unlocks collateral on full repayment via smart contract)
      await api.repayLoan(loanId, amount);

      // Refresh data to get updated loan status and unlocked collateral
      await refreshData();

      if (isFullRepayment) {
        setFullRepaymentSuccess(true);
        setTimeout(() => setFullRepaymentSuccess(false), 5000);
      } else {
        setRepaymentSuccess(true);
        setTimeout(() => setRepaymentSuccess(false), 3000);
      }
    } catch (err) {
      setRepaymentError(err instanceof Error ? err.message : 'Failed to repay loan');
    }
  };

  const activeLoans = displayLoans.filter(l => l.status === 'Active' || l.status === 'MarginCall');
  const totalOwed = activeLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
  const avgLTV = activeLoans.length > 0
    ? activeLoans.reduce((sum, loan) => sum + loan.currentLTV, 0) / activeLoans.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">My Loans</h1>
        <p className="text-slate-600">
          Manage your active loans and monitor LTV risk
        </p>
      </div>

      {/* Critical Alert Banner for At-Risk Loans */}
      {displayLoans.some(l => l.status === 'MarginCall' || l.status === 'Liquidating') && (
        <Card className="border-red-200 bg-red-50 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-700 font-bold text-lg mb-1">⚠️ URGENT: Loans at Risk of Liquidation!</p>
                <p className="text-red-600 font-medium">
                  You have {displayLoans.filter(l => l.status === 'MarginCall' || l.status === 'Liquidating').length} loan(s)
                  {displayLoans.some(l => l.status === 'Liquidating') ? ' in liquidation process' : ' above 80% LTV'}.
                  <strong className="ml-1">Take immediate action to avoid collateral seizure:</strong>
                </p>
                <ul className="mt-3 space-y-1 text-sm text-red-700">
                  <li className="flex items-center gap-2">
                    <span className="font-bold">1.</span>
                    <span>Make a payment to reduce your outstanding balance, OR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">2.</span>
                    <span>Add more collateral to increase your collateral value</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">⏱️</span>
                    <span><strong>Liquidation threshold: 85% LTV</strong> - Collateral will be seized automatically</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {repaymentError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 font-medium text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {repaymentError}
            </p>
          </CardContent>
        </Card>
      )}

      {fullRepaymentSuccess && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 font-bold text-lg">Loan Fully Repaid!</p>
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">
                Your collateral has been automatically unlocked! You can now withdraw it from the home page.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {repaymentSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-700 font-medium text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payment processed! Your LTV has been updated.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Active Loans</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{activeLoans.length}</div>
            <p className="text-xs text-slate-500">Currently outstanding</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Total Outstanding</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{formatCurrency(totalOwed)}</div>
            <p className="text-xs text-slate-500">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Average LTV</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 font-numeric ${avgLTV >= 0.80 ? 'text-red-600' : avgLTV >= 0.70 ? 'text-amber-600' : 'text-green-600'}`}>
              {(avgLTV * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500">Margin call at 80% | Liquidation at 85%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Loan Overview</CardTitle>
          <CardDescription>
            View and manage your active loans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayLoans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No loans found.</p>
              <p className="text-sm text-slate-500 mt-2">Request a loan to get started.</p>
            </div>
          ) : (
            <LoanTable loans={displayLoans} onRepay={handleRepay} />
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Risk Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-green-600 font-bold mt-0.5">Safe</span>
              <span className="leading-relaxed">LTV below 70% - Your loan is in a healthy position</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-amber-600 font-bold mt-0.5">Warning</span>
              <span className="leading-relaxed">LTV at 80% - Margin call triggered, add collateral or make a payment</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <span className="text-red-600 font-bold mt-0.5">Critical</span>
              <span className="leading-relaxed">LTV at 85% - Liquidation triggered, collateral will be seized</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
