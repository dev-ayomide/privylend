import { Ledger } from '@daml/ledger';
import { Party } from '@daml/types';

// Get ledger connection from environment
const LEDGER_URL = process.env.NEXT_PUBLIC_LEDGER_URL || 'http://localhost:6865';
const LEDGER_TOKEN = process.env.NEXT_PUBLIC_LEDGER_TOKEN || '';

export interface LedgerConfig {
  token?: string;
  httpBaseUrl?: string;
}

export const createLedger = (config?: LedgerConfig): Ledger => {
  return new Ledger({
    token: config?.token || LEDGER_TOKEN,
    httpBaseUrl: config?.httpBaseUrl || LEDGER_URL,
  });
};

export type { Party };

