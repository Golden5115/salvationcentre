import { apiRequest } from './client';
import type { ServiceType, ServiceTypeResponse } from '../types/service-type';

// GET /api/service-types
export async function getServiceTypes(): Promise<ServiceType[]> {
  const response = await apiRequest<ServiceTypeResponse>('/api/service-types');
  
  if (response.success && response.data) {
    if (response.data.success !== undefined && response.data.data) {
      return response.data.data;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
  }
  
  return [];
}