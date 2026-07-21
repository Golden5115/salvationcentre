// src/lib/api/special-events.ts
import { apiRequest } from './client';
import type {
  SpecialEvent,
  CreateSpecialEventInput,
  UpdateSpecialEventInput,
  SpecialEventResponse,
  SingleSpecialEventResponse
} from '../types/special-event';

// Public: Get published special events
export async function getSpecialEvents(): Promise<SpecialEventResponse> {
  const response = await apiRequest<{ data: SpecialEvent[] }>('/api/special-events', 'GET');

  if (response.success && response.data) {
    const events = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    return {
      success: true,
      data: events,
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to load special events',
  };
}

// Admin functions 
export async function adminGetSpecialEvents(): Promise<SpecialEventResponse> {
  const response = await apiRequest<{ data: SpecialEvent[] }>('/api/admin/special-events', 'GET');
  
  if (response.success && response.data) {
    const events = Array.isArray(response.data) ? response.data : response.data.data || [];
    return {
      success: true,
      data: events,
    };
  }
  
  return {
    success: false,
    error: response.error || 'Failed to load special events',
  };
}

export async function createSpecialEvent(
  event: CreateSpecialEventInput
): Promise<SingleSpecialEventResponse> {
  return apiRequest<SpecialEvent>('/api/admin/special-events', 'POST', event);
}

export async function updateSpecialEvent(
  id: number,
  updates: UpdateSpecialEventInput
): Promise<SingleSpecialEventResponse> {
  return apiRequest<SpecialEvent>(`/api/admin/special-events/${id}`, 'PUT', updates);
}

export async function deleteSpecialEvent(
  id: number
): Promise<{ success: boolean; error?: string }> {
  return apiRequest(`/api/admin/special-events/${id}`, 'DELETE');
}