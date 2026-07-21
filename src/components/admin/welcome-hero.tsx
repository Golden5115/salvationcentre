/* eslint-disable react/no-unescaped-entities */
import type { AdminUser } from "@/lib/types/admin";

interface WelcomeHeroProps {
  user: AdminUser;
}

export function WelcomeHero({ user }: WelcomeHeroProps) {
  const firstName = user.email.split("@")[0];

 
  const formattedName = firstName
    .split(/[. _-]/) // split on common separators
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-linear-to-r from-[#C80036]/20 to-purple-600/20 rounded-2xl blur-2xl opacity-50" />
      <div className="relative backdrop-blur-md bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-white font-teko text-4xl lg:text-5xl font-bold mb-2">
              Welcome back, {formattedName}!
            </h1>
            <p className="text-white/70 text-lg">
              Here's what's happening with your church today
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-[#C80036] text-white text-sm font-semibold shadow-lg shadow-[#C80036]/30">
            {user.role === "superadmin"
              ? "Super Admin"
              : user.role
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
          </span>
        </div>
      </div>
    </div>
  );
}