import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollateralAccount, ASSET_CONFIG } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface CollateralCardProps {
  collateral: CollateralAccount;
  onWithdraw?: (collateralId: string) => void;
  onUnlock?: (collateralId: string) => void;
}

export function CollateralCard({ collateral, onWithdraw, onUnlock }: CollateralCardProps) {
  const config = ASSET_CONFIG[collateral.assetType];

  const getAssetColor = (type: string) => {
    switch (type) {
      case 'cBTC':
        return 'bg-orange-50 border-orange-200';
      case 'cETH':
        return 'bg-blue-50 border-blue-200';
      case 'USDC':
        return 'bg-green-50 border-green-200';
      case 'USDT':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'cBTC':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cETH':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'USDC':
      case 'USDT':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${getAssetColor(collateral.assetType)} flex items-center justify-center border`}>
              {getAssetIcon(collateral.assetType)}
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-slate-900">
                {collateral.assetType} - {config.name}
              </CardTitle>
              <p className="text-xs text-slate-500 font-numeric">
                {collateral.quantity} {collateral.assetType} @ {formatCurrency(collateral.marketPrice)}
              </p>
            </div>
          </div>
          {collateral.status === 'Locked' ? (
            <Badge variant="danger" className="bg-red-50 text-red-700 border-red-200">
              Locked
            </Badge>
          ) : (
            <Badge className="bg-green-50 text-green-700 border-green-200">
              Available
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-slate-500">Effective Value (after {collateral.haircut * 100}% haircut)</p>
            <div className="text-2xl font-bold text-slate-900 font-numeric">{formatCurrency(collateral.effectiveValue)}</div>
          </div>
          <p className="text-xs text-slate-500">
            Max borrowable: <span className="text-blue-600 font-medium font-numeric">{formatCurrency(collateral.effectiveValue * 0.70)}</span>
          </p>
          {collateral.status === 'Available' && onWithdraw && (
            <div className="mt-3">
              <Button
                onClick={() => onWithdraw(collateral.id)}
                variant="outline"
                className="w-full text-sm border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Withdraw
              </Button>
            </div>
          )}
          {collateral.status === 'Locked' && (
            <div className="mt-3">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secured against an active loan. Unlocks automatically on full repayment.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
