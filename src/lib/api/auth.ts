// src/lib/api/auth.ts
import { apiRequest } from './client';

type AdminRole = 
  | "superadmin"
  | "media_team"
  | "secretariat"
  | "visitors_welfare";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export async function loginWithIdToken(idToken: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const response = await apiRequest<AdminUser>('/api/auth/login', 'POST', { idToken });
  
  if (response.success && response.data) {
    return {
      success: true,
      user: response.data,
    };
  }
  
  return { success: false, error: response.error };
}

export async function logout(): Promise<{ success: boolean; error?: string }> {
  const response = await apiRequest('/api/auth/logout', 'POST');
  return { success: response.success, error: response.error };
}

export async function getCurrentUser(): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const response = await apiRequest<{ id: string; name: string; email: string; role: string }>('/api/auth/me', 'GET');
  
  if (response.success && response.data) {
    return {
      success: true,
      user: {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role as AdminRole,
      },
    };
  }
  
  return { success: false, error: response.error };
}