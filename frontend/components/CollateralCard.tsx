import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CollateralAccount, ASSET_CONFIG } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface CollateralCardProps {
  collateral: CollateralAccount;
}

export function CollateralCard({ collateral }: CollateralCardProps) {
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
          {collateral.status === 'Locked' && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-xs text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Collateral is locked against an active loan
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
