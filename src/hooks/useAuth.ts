// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/api/auth';

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

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          window.location.href = '/admin/login';
        }
      })
      .catch(() => {
        window.location.href = '/admin/login';
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/admin/login';
  };

  return { user, loading, logout };
}