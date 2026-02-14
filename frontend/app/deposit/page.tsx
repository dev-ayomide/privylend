'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { usePrivyLend } from '@/hooks/usePrivyLend';
import { AssetType, ASSET_CONFIG } from '@/lib/types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

export default function DepositPage() {
  const [quantity, setQuantity] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('cBTC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { api } = usePrivyLend();

  const config = ASSET_CONFIG[assetType];
  const qty = parseFloat(quantity || '0');
  const rawValue = qty * config.price;
  const effectiveValue = rawValue * (1 - config.haircut);
  const maxBorrowable = effectiveValue * 0.70;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (USE_MOCK_DATA || !api) {
      const { addCollateral } = await import('@/lib/mockData');
      setTimeout(() => {
        addCollateral({
          assetType,
          quantity: qty,
          marketPrice: config.price,
          haircut: config.haircut,
          effectiveValue,
          status: 'Available',
          depositTimestamp: new Date().toISOString(),
        });
        setIsSubmitting(false);
        setSuccess(true);
        setQuantity('');
        setTimeout(() => {
          setSuccess(false);
          window.location.reload();
        }, 1500);
      }, 1000);
      return;
    }

    try {
      if (qty <= 0) {
        throw new Error('Quantity must be positive');
      }
      await api.depositCollateral(assetType, qty);
      setSuccess(true);
      setQuantity('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit collateral');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Deposit Collateral</h1>
        <p className="text-slate-600">
          Deposit Canton-native assets to use as collateral for loans
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">New Collateral Deposit</CardTitle>
          <CardDescription>
            Your collateral is secured on Canton with privacy guarantees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="assetType" className="text-sm font-medium text-slate-700">Asset Type</Label>
              <select
                id="assetType"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="cBTC">cBTC - Canton Bitcoin</option>
                <option value="cETH">cETH - Canton Ethereum</option>
                <option value="USDC">USDC - USD Coin</option>
                <option value="USDT">USDT - Tether</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min={0}
                step="any"
                className="font-numeric"
                required
              />
              <p className="text-xs text-slate-500">
                Current price: <span className="text-blue-600 font-medium font-numeric">{formatCurrency(config.price)}</span> per {assetType}
              </p>
            </div>

            {qty > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6 space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Raw Value:</p>
                    <p className="text-2xl font-bold text-slate-900 font-numeric">
                      {formatCurrency(rawValue)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">
                      Effective Value (after {config.haircut * 100}% haircut):
                    </p>
                    <p className="text-xl font-semibold text-emerald-600 font-numeric">
                      {formatCurrency(effectiveValue)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Max Borrowable (70% LTV):</p>
                    <p className="text-lg font-semibold text-indigo-600 font-numeric">
                      {formatCurrency(maxBorrowable)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    Collateral deposited successfully!
                  </p>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || !quantity || qty <= 0}
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
              <span className="leading-relaxed">Only you and the lending pool see your transaction details</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Canton-native assets secured by Daml smart contracts</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Risk-adjusted haircuts protect against market volatility</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">Automatic LTV monitoring with margin call protection</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
