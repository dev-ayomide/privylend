'use client';

import { useState } from 'react';
import { LoanTable } from '@/components/LoanTable';
import { mockLoans } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoansPage() {
  const [loans, setLoans] = useState(mockLoans);
  const [repaymentSuccess, setRepaymentSuccess] = useState(false);

  const handleRepay = (loanId: string, amount: number) => {
    console.log('Repaying loan:', loanId, amount);
    
    setLoans(loans.map(loan =>
      loan.id === loanId
        ? { ...loan, status: 'Repaid' as const }
        : loan
    ));
    
    setRepaymentSuccess(true);
    setTimeout(() => setRepaymentSuccess(false), 3000);
  };

  const activeLoans = loans.filter(l => l.status === 'Active');
  const totalOwed = activeLoans.reduce((sum, loan) => sum + loan.totalOwed, 0);
  const avgInterest = activeLoans.length > 0
    ? activeLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / activeLoans.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">My Loans</h1>
        <p className="text-slate-600">
          Manage your active loans and repayment schedule
        </p>
      </div>

      {repaymentSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-700 font-medium text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Loan repaid successfully! Your collateral has been unlocked.
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
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Total Amount Owed</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{formatCurrency(totalOwed)}</div>
            <p className="text-xs text-slate-500">Principal + Interest</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Average Interest</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{avgInterest.toFixed(1)}%</div>
            <p className="text-xs text-slate-500">Across all loans</p>
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
          <LoanTable loans={loans} onRepay={handleRepay} />
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Repayment Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Repay loans before the due date to avoid liquidation</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Your collateral is automatically unlocked after repayment</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Interest is calculated based on the actual loan duration</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Early repayment may reduce total interest paid</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

