interface ActivityItemProps {
  avatar: string
  action: string
  time: string
  color: string
}

export function ActivityItem({ avatar, action, time, color }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
      <div
        className={`w-10 h-10 rounded-full bg-linear-to-br ${color} flex items-center justify-center shrink-0`}
      >
        <span className="text-white font-teko text-lg font-bold">{avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm leading-relaxed">{action}</p>
        <p className="text-white/40 text-xs mt-1">{time}</p>
      </div>
    </div>
  )
}
