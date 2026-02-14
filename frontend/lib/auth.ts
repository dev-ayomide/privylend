import { Party } from '@daml/types';

// In production, you'd use proper authentication
// For now, use localStorage or fall back to default party
export const getCurrentParty = (): Party | null => {
  if (typeof window === 'undefined') return null;
  const party = localStorage.getItem('daml_party');
  // Fall back to Canton party from env var for development
  return (party || process.env.NEXT_PUBLIC_CANTON_PARTY || 'Alice') as Party;
};

export const setCurrentParty = (party: Party): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('daml_party', party);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('daml_token');
  // Fall back to environment variable token for development
  return token || process.env.NEXT_PUBLIC_LEDGER_TOKEN || null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('daml_token', token);
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('daml_party');
  localStorage.removeItem('daml_token');
};


