// src/lib/types/admin.ts
export type AdminRole = 
  | "superadmin"
  | "media_team"
  | "secretariat"
  | "visitors_welfare";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}