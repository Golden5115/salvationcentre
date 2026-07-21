// src/lib/api/regular-programs.ts
import { apiRequest } from './client';
import type {
  RegularProgram,
  CreateRegularProgramInput,
  UpdateRegularProgramInput,
  RegularProgramResponse,
  SingleRegularProgramResponse
} from '../types/regular-program';

// Public
export async function getRegularPrograms(): Promise<RegularProgramResponse> {
  const response = await apiRequest<{ data: RegularProgram[] }>('/api/regular-programs', 'GET');

  if (response.success && response.data) {
    const programs = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    return {
      success: true,
      data: programs,
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to load regular programs',
  };
}

export async function adminGetRegularPrograms(): Promise<RegularProgramResponse> {
  const response = await apiRequest<{ data: RegularProgram[] }>('/api/admin/regular-programs', 'GET');
  
  if (response.success && response.data) {
    const programs = Array.isArray(response.data) ? response.data : response.data.data || [];
    return {
      success: true,
      data: programs,
    };
  }
  
  return {
    success: false,
    error: response.error || 'Failed to load regular programs',
  };
}

export async function createRegularProgram(
  program: CreateRegularProgramInput
): Promise<SingleRegularProgramResponse> {
  return apiRequest<RegularProgram>('/api/admin/regular-programs', 'POST', program);
}

export async function updateRegularProgram(
  id: number,
  updates: UpdateRegularProgramInput
): Promise<SingleRegularProgramResponse> {
  return apiRequest<RegularProgram>(`/api/admin/regular-programs/${id}`, 'PUT', updates);
}

export async function deleteRegularProgram(
  id: number
): Promise<{ success: boolean; error?: string }> {
  return apiRequest(`/api/admin/regular-programs/${id}`, 'DELETE');
}