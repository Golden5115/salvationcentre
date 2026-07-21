
"use client";

import { Menu } from "lucide-react";
import type { AdminUser } from "@/lib/types/admin";

interface HeaderProps {
  user: AdminUser;
  onMenuClick: () => void;
  onLogout: () => void;
}

const roleColors: Record<string, string> = {
  superadmin: "bg-[#C80036] text-white",
  media_team: "bg-purple-600 text-white",
  secretariat: "bg-green-600 text-white",
  visitors_welfare: "bg-orange-600 text-white",
};

const roleLabels: Record<string, string> = {
  superadmin: "Super Admin",
  media_team: "Media Team",
  secretariat: "Secretariat",
  visitors_welfare: "Visitors Welfare",
};

export function Header({ user, onMenuClick, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-black/80 border-b border-white/10">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <button onClick={onMenuClick} className="lg:hidden text-white/70 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#C80036] flex items-center justify-center">
            <span className="text-white font-teko text-base font-bold">RC</span>
          </div>
        </div>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white font-medium text-sm">{user.email}</p>
            <p className="text-white/60 text-xs">Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
            <button
              onClick={onLogout}
              className="text-white/70 hover:text-white text-sm font-roboto transition-colors"
            >
              Logout
            </button>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#C80036] to-[#0C1844] flex items-center justify-center">
              <span className="text-white font-teko text-lg font-bold">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}