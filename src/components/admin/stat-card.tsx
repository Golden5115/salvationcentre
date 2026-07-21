import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  trend?: string
}

export function StatCard({ title, value, icon: Icon, iconColor, trend }: StatCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm font-medium mb-2">{title}</p>
            <p className="text-white font-teko text-4xl font-bold">{value}</p>
            {trend && <p className="text-emerald-400 text-xs font-medium mt-2">{trend}</p>}
          </div>
          <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10 border border-current border-opacity-20`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
