import type { Dietitian } from '@/types';
import apiClient from './client';

export async function getPairedDietitian(): Promise<Dietitian | null> {
  try {
    // Patient's paired dietitian info comes from patient profile or dedicated endpoint
    const { data } = await apiClient.get('/dietitians/me');
    return (data.data ?? data) as Dietitian;
  } catch {
    return null;
  }
}

export async function requestPairing(code: string): Promise<Dietitian> {
  const { data } = await apiClient.post('/dietitians/pair', { inviteCode: code });
  return (data.data ?? data) as Dietitian;
}

/**
 * Onboarding alias — same as requestPairing but with a clearer name.
 * Sends `{ inviteCode }` in the JSON body (NOT as query param).
 */
export async function pairWithDietitian(code: string): Promise<Dietitian> {
  return requestPairing(code);
}

export async function unpairDietitian(): Promise<void> {
  // TODO: Backend unpair endpoint needed
}

export async function getDietitians(): Promise<Dietitian[]> {
  // Public dietitian listing not available for patients
  return [];
}

export async function getDietitianById(id: string): Promise<Dietitian | null> {
  try {
    const { data } = await apiClient.get(`/dietitians/${id}`);
    return (data.data ?? data) as Dietitian;
  } catch {
    return null;
  }
}
