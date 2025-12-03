import { Party } from '@daml/types';

// In production, you'd use proper authentication
// For now, store party in localStorage or session
export const getCurrentParty = (): Party | null => {
  if (typeof window === 'undefined') return null;
  const party = localStorage.getItem('daml_party');
  return party as Party | null;
};

export const setCurrentParty = (party: Party): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('daml_party', party);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('daml_token');
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


