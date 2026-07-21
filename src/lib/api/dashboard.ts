// lib/api/dashboard.ts
import { apiRequest } from './client';
import { DashboardData } from '../../lib/types/dashboard';

interface ApiError extends Error {
  code?: number;
}

export const dashboardApi = {
  async getDashboard(): Promise<DashboardData> {
    const response = await apiRequest<DashboardData>('/api/admin/dashboard');
    
    if (!response.success) {
      // Throw error with code for proper handling
      const error = new Error(response.error || 'Failed to fetch dashboard data') as ApiError;
      error.code = response.code;
      throw error;
    }
    
    if (!response.data) {
      throw new Error('No data returned from dashboard API');
    }
    

    return response.data;
  }
};