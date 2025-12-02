'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency, calculateMaxLoan } from '@/lib/utils';
import { LTV_RATIO } from '@/lib/mockData';

interface LoanFormProps {
  collateralValue: number;
  onSubmit: (data: { amount: number; termDays: number; interestRate: number }) => void;
}

export function LoanForm({ collateralValue, onSubmit }: LoanFormProps) {
  const [amount, setAmount] = useState('');
  const [termDays, setTermDays] = useState('365');
  const [interestRate] = useState(5.0);

  const maxLoan = calculateMaxLoan(collateralValue, LTV_RATIO);
  const requestedAmount = parseFloat(amount) || 0;
  const ltv = collateralValue > 0 ? (requestedAmount / collateralValue) * 100 : 0;
  const isValidLTV = ltv <= 70 && requestedAmount > 0;

  const estimatedInterest = (requestedAmount * (interestRate / 100) * (parseInt(termDays) / 365));
  const totalRepayment = requestedAmount + estimatedInterest;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidLTV) {
      onSubmit({
        amount: requestedAmount,
        termDays: parseInt(termDays),
        interestRate,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Loan Request Calculator</CardTitle>
          <CardDescription>
            Maximum loan: <span className="font-semibold text-blue-600 font-numeric">{formatCurrency(maxLoan)}</span> (70% LTV)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="collateral" className="text-sm font-medium text-slate-700">Collateral Value</Label>
            <Input
              id="collateral"
              type="text"
              value={formatCurrency(collateralValue)}
              disabled
              className="bg-slate-50 text-slate-600 font-numeric"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-slate-700">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={maxLoan}
                min={0}
                step={1000}
                className="pl-8 pr-20 font-numeric"
                required
              />
              <button
                type="button"
                onClick={() => setAmount(maxLoan.toString())}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                MAX
              </button>
            </div>
            {amount && !isValidLTV && (
              <p className="text-sm text-red-600 flex items-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Amount exceeds 70% LTV limit. Maximum: {formatCurrency(maxLoan)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="term" className="text-sm font-medium text-slate-700">Loan Term</Label>
            <select
              id="term"
              value={termDays}
              onChange={(e) => setTermDays(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="90">90 days (3 months)</option>
              <option value="180">180 days (6 months)</option>
              <option value="365">365 days (1 year)</option>
              <option value="730">730 days (2 years)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate" className="text-sm font-medium text-slate-700">Interest Rate</Label>
            <Input
              id="rate"
              type="text"
              value={`${interestRate}% APR`}
              disabled
              className="bg-slate-50 text-slate-600 font-numeric"
            />
          </div>

          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Current LTV:</span>
              <span className={`${ltv > 70 ? 'text-red-600' : 'text-slate-900'} font-semibold font-numeric`}>
                {ltv.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Estimated Interest:</span>
              <span className="text-slate-900 font-semibold font-numeric">{formatCurrency(estimatedInterest)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <span className="font-semibold text-slate-900">Total Repayment:</span>
              <span className="text-xl font-bold text-slate-900 font-numeric">{formatCurrency(totalRepayment)}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            disabled={!isValidLTV}
          >
            Request Loan
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

