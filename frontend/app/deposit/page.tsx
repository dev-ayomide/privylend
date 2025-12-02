'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [assetType, setAssetType] = useState('Crypto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setAmount('');
      
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Deposit Collateral</h1>
        <p className="text-slate-600">
          Deposit assets to use as collateral for loans
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">New Collateral Deposit</CardTitle>
          <CardDescription>
            Your collateral is secured on the blockchain with privacy guarantees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="assetType" className="text-sm font-medium text-slate-700">Asset Type</Label>
              <select
                id="assetType"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Crypto">Cryptocurrency</option>
                <option value="RealEstate">Real Estate</option>
                <option value="Securities">Securities</option>
                <option value="Commodities">Commodities</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-slate-700">Collateral Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1000}
                  step={1000}
                  className="pl-8 font-numeric"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">
                Minimum deposit: <span className="text-blue-600 font-medium font-numeric">{formatCurrency(1000)}</span>
              </p>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sm text-slate-700 mb-2 uppercase tracking-wider">Estimated Loan Capacity</h3>
                  <p className="text-2xl font-bold text-slate-900 mb-1 font-numeric">
                    {formatCurrency(parseFloat(amount) * 0.7)}
                  </p>
                  <p className="text-xs text-slate-600">
                    Up to 70% LTV ratio
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
                    Collateral deposited successfully!
                  </p>
                </CardContent>
              </Card>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? 'Processing...' : 'Deposit Collateral'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Privacy Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Your identity remains private on the blockchain</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Asset details are encrypted and only visible to authorized parties</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Smart contracts ensure your collateral is secure</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Regulatory compliance without sacrificing privacy</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

