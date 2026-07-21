

export type UserRole =
  | "superadmin"
  | "content_manager"
  | "media_team"
  | "secretariat"
  | "visitors_welfare";


export interface AdminUser {
  email: string;
  role: UserRole;
}

export interface MenuItem {
  label: string;
  icon: string;
  href: string;
  roles: UserRole[];
}