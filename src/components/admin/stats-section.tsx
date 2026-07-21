// components/admin/stats-section.tsx
import { StatCard } from "./stat-card"
import { Mic2, HeartHandshake, UsersRound, Sparkles, HandHelping } from "lucide-react"
import { DashboardData } from "../../lib/types/dashboard"

interface StatsSectionProps {
  data: DashboardData & {
    totalPrayerRequests?: number
    pendingPrayerRequests?: number
  } | null;
}

export function StatsSection({ data }: StatsSectionProps) {
  const totalSermons = data?.totalSermons || 0;
  const pendingTestimonies = data?.pendingTestimonies || 0;
  const todaysFirstTimers = data?.todaysFirstTimers || 0;
  const upcomingEventsCount = data?.upcomingEvents?.length || 0;
  const firstEventTitle = data?.upcomingEvents?.[0]?.title || "";

  const totalPrayerRequests = data?.totalPrayerRequests || 0;
  const pendingPrayerRequests = data?.pendingPrayerRequests || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {/* Total Sermons */}
      <StatCard 
        title="Total Sermons" 
        value={totalSermons} 
        icon={Mic2} 
        iconColor="text-blue-400" 
      />

      {/* Pending Testimonies */}
      <StatCard
        title="Pending Testimonies"
        icon={HeartHandshake}
        value={pendingTestimonies}
        iconColor="text-rose-400"
        trend={pendingTestimonies > 0 ? `${pendingTestimonies} need review` : undefined}
      />

      {/* Today's First-Timers */}
      <StatCard
        title="Today's First-Timers"
        value={todaysFirstTimers}
        icon={UsersRound}
        iconColor="text-emerald-400"
      />

      {/* Upcoming Events */}
      <StatCard
        title="Upcoming Events"
        value={upcomingEventsCount}
        icon={Sparkles}
        iconColor="text-purple-400"
        trend={firstEventTitle ? `Next: ${firstEventTitle}` : undefined}
      />

      {/* Prayer Requests */}
      <StatCard
        title="Prayer Requests"
        value={totalPrayerRequests}
        icon={HandHelping}
        iconColor="text-emerald-400"
        trend={pendingPrayerRequests > 0 ? `${pendingPrayerRequests} pending` : undefined}
      />
    </div>
  )
}