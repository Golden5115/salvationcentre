// src/lib/api/prayer-requests.ts
import { apiRequest } from './client';
import type {
  PrayerRequest,
  CreatePrayerRequestInput,
  UpdatePrayerRequestInput,
  PrayerRequestResponse,
  SinglePrayerRequestResponse,
} from '../types/prayer-request';

// Publi
export async function createPrayerRequest(
  input: CreatePrayerRequestInput
): Promise<SinglePrayerRequestResponse> {
  return apiRequest<PrayerRequest>('/api/prayer-requests', 'POST', input);
}

// Admin: Get all prayer requests
export async function adminGetPrayerRequests(): Promise<PrayerRequestResponse> {
  return apiRequest<PrayerRequest[]>('/api/admin/prayer-requests', 'GET');
}

// Admin: Update prayer request 
export async function updatePrayerRequest(
  id: number,
  updates: UpdatePrayerRequestInput
): Promise<SinglePrayerRequestResponse> {
  return apiRequest<PrayerRequest>(`/api/admin/prayer-requests/${id}`, 'PUT', updates);
}

// Admin: Delete prayer request
export async function deletePrayerRequest(
  id: number
): Promise<{ success: boolean; error?: string }> {
  return apiRequest(`/api/admin/prayer-requests/${id}`, 'DELETE');
}