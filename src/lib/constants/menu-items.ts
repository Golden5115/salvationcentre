import type { MenuItem } from "@/lib/types/admin"

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "layout-dashboard",
    href: "/admin/dashboard",
    roles: ["superadmin", "content_manager", "media_team", "secretariat", "visitors_welfare"],
  },
  {
    label: "Sermons",
    icon: "mic-2",
    href: "/admin/sermons",
    roles: ["superadmin", "content_manager", "media_team"],
  },
  {
    label: "Testimonies",
    icon: "heart-handshake",
    href: "/admin/testimonies",
    roles: ["superadmin", "content_manager", "secretariat"],
  },
  {
    label: "Regular Programs",
    icon: "calendar-check-2",
    href: "/admin/programs",
    roles: ["superadmin", "content_manager", "secretariat"],
  },
  {
    label: "Special Events",
    icon: "sparkles",
    href: "/admin/events",
    roles: ["superadmin", "content_manager", "secretariat"],
  },
  {
    label: "First-Timers",
    icon: "users-round",
    href: "/admin/first-timers",
    roles: ["superadmin", "secretariat", "visitors_welfare"],
  },
  {
    label: "Attendance Logs",
    icon: "calendar-days",
    href: "/admin/attendance",
    roles: ["superadmin", "secretariat", "visitors_welfare"],
  },
  {
    label: "Visitors Analytics",
    icon: "trending-up",
    href: "/admin/analytics",
    roles: ["superadmin", "secretariat", "visitors_welfare"],
  },
  {
    label: "Site Settings",
    icon: "settings",
    href: "/admin/settings",
    roles: ["superadmin", "content_manager", "secretariat"],
  },
  {
    label: "Admin Users",
    icon: "shield-check",
    href: "/admin/users",
    roles: ["superadmin"],
  },
]
