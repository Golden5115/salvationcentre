// src/lib/api/types.ts
export interface User {
  email: string;
  role: 'superadmin' | 'media_team' | 'secretariat' | 'visitors_welfare';
}