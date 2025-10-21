import { apiCall } from './client';

export async function generatePairingCode(userId: string) {
  return apiCall<{ code: string }>('/Pairing/generateCode', { user: userId });
}

export async function acceptPairingCode(userId: string, code: string) {
  return apiCall<{ pair: string }>('/Pairing/acceptPairing', { user: userId, code });
}

export async function dissolvePair(pairId: string) {
  return apiCall<{ message: string }>('/Pairing/dissolvePair', { pairId });
}

export async function getPair(userId: string) {
  return apiCall<{ pair: string }>('/Pairing/getPair', { user: userId });
}

export async function isPaired(userId: string) {
  return apiCall<boolean>('/Pairing/isPaired', { user: userId });
}
