
import { UpcomingEvent } from '../../lib/types/dashboard';

interface UpcomingScheduleSectionProps {
  events?: UpcomingEvent[] | null; 
}

export function UpcomingScheduleSection({ events = [] }: UpcomingScheduleSectionProps) {
  // Convert null to empty array
  const displayEvents = events || [];
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        day: date.getDate().toString(),
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return {
        day: '??',
        month: '??',
        weekday: '??',
        time: '??:??'
      };
    }
  };

  const getEventColor = (index: number) => {
    const colors = [
      { bg: 'bg-[#C80036]/10', border: 'border-[#C80036]/30', text: 'text-[#C80036]' },
      { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
      { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
      { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
      { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
      { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-teko text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="space-y-4">
        {displayEvents.length === 0 ? (
          <p className="text-white/60 text-center py-4">No upcoming events</p>
        ) : (
          displayEvents.slice(0, 6).map((event, index) => {
            const formattedDate = formatDate(event.date);
            const color = getEventColor(index);
            
            return (
              <div key={event.id || index} className="flex items-start gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                <div className={`w-12 h-12 rounded-lg ${color.bg} ${color.border} flex flex-col items-center justify-center shrink-0`}>
                  <span className={`${color.text} font-teko text-lg font-bold leading-none`}>
                    {formattedDate.day}
                  </span>
                  <span className={`${color.text}/70 text-xs font-medium`}>
                    {formattedDate.month}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm line-clamp-1">{event.title || 'Untitled Event'}</p>
                  <p className="text-white/60 text-xs mt-1">
                    {formattedDate.weekday}, {formattedDate.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}