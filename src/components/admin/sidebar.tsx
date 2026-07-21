"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Mic2,
  HeartHandshake,
  CalendarCheck2,
  Sparkles,
  UsersRound,
  CalendarDays,
  TrendingUp,
  LogOut,
  HandHelping,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdminUser } from "@/lib/types/admin"
import { menuItems } from "@/lib/constants/menu-items"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "mic-2": Mic2,
  "heart-handshake": HeartHandshake,
  "calendar-check-2": CalendarCheck2,
  sparkles: Sparkles,
  "users-round": UsersRound,
  "calendar-days": CalendarDays,
  "trending-up": TrendingUp,
  "log-out": LogOut,
  "hand-helping": HandHelping,
}

interface SidebarProps {
  user: AdminUser
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export function Sidebar({ user, isOpen, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname()


  const excludedLabels = ["Visitors Analytics", "Site Settings", "Admin Users"]

  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(user.role))
    .filter((item) => !excludedLabels.includes(item.label))

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar - Fixed height to not touch navbar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-[calc(100vh-4rem)] mt-16 bg-black z-50 transition-transform duration-300 ease-in-out",
          "w-64 border-r-4 border-white/30",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-8">
            <ul className="space-y-2 px-4">
              {filteredMenuItems.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200",
                        "text-white/70 hover:text-white hover:bg-white/10",
                        isActive && [
                          "bg-white text-black",
                          "hover:bg-white hover:text-black",
                        ],
                      )}
                    >
                      {Icon && <Icon className="w-5 h-5 shrink-0" />}
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  </li>
                )
              })}

              {/* Prayer Requests link */}
              <li>
                <Link
                  href="/admin/prayer-requests"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200",
                    "text-white/70 hover:text-white hover:bg-white/10",
                    pathname === "/admin/prayer-requests" && [
                      "bg-white text-black",
                      "hover:bg-white hover:text-black",
                    ],
                  )}
                >
                  <HandHelping className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">Prayer Requests</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-8 border-t border-white/30">
            <button 
              onClick={onLogout}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-gray-100 text-black font-bold uppercase tracking-wider rounded-xl transition-all border-4 border-white hover:border-gray-100"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}