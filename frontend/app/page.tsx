'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollateralCard } from '@/components/CollateralCard';
import { mockCollateral, mockLoans } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export default function Home() {
  const totalCollateral = mockCollateral.reduce((sum, acc) => sum + acc.value, 0);
  const activeLoansCount = mockLoans.filter(loan => loan.status === 'Active').length;
  const totalBorrowed = mockLoans.filter(loan => loan.status === 'Active')
    .reduce((sum, loan) => sum + loan.principal, 0);
  const availableToWithdraw = mockCollateral
    .filter(acc => acc.status === 'Available')
    .reduce((sum, acc) => sum + acc.value, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome to PrivyLend</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Privacy-preserving lending protocol built on Canton. Borrow with confidence while maintaining your privacy.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Total Collateral</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{formatCurrency(totalCollateral)}</div>
            <p className="text-xs text-slate-500">Across {mockCollateral.length} accounts</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Active Loans</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{activeLoansCount}</div>
            <p className="text-xs text-slate-500">Currently outstanding</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Total Borrowed</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{formatCurrency(totalBorrowed)}</div>
            <p className="text-xs text-slate-500">Principal amount</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Available to Withdraw</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">{formatCurrency(availableToWithdraw)}</div>
            <p className="text-xs text-slate-500">Unlocked collateral</p>
          </CardContent>
        </Card>
      </div>

      {/* Collateral Overview */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-1">Your Collateral</h2>
          <p className="text-slate-600">Manage and monitor your deposited assets</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCollateral.map((collateral) => (
            <CollateralCard key={collateral.id} collateral={collateral} />
          ))}
        </div>
      </div>

      {/* Privacy Features */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Privacy & Compliance Features</CardTitle>
          <CardDescription>How PrivyLend protects your information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900">For Borrowers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Prove creditworthiness without revealing identity or full financial history
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900">For Lenders</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify collateral exists without seeing specific asset details
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900">For Regulators</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Audit compliance without accessing all transaction details
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
