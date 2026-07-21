import EventsHero from '@/components/events/EventsHero'
import CalendarExportButton from '@/components/events/CalendarExportButton'
import { getSpecialEvents } from '@/lib/api/special-events'
import { getRegularPrograms } from '@/lib/api/regular-programs'
import type { SpecialEvent } from '@/lib/types/special-event'
import type { RegularProgram } from '@/lib/types/regular-program'
import { Clock, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Events & Calendar - Church Programs & Services',
  description: 'View our church calendar with regular programs, Bible studies, prayer meetings, and special events.',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Date TBD'
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTimeForDisplay(startTime?: string, endTime?: string): string {
  if (!startTime && !endTime) return 'Time TBD'
  if (!startTime) return `Ends at ${endTime}`
  if (!endTime) return `Starts at ${startTime}`
  return `${startTime} – ${endTime}`
}

const typeBadgeStyles = [
  'bg-black text-white border-black',
  'bg-white text-black border-black',
  'bg-gray-200 text-black border-black',
  'bg-gray-800 text-white border-gray-800',
]

function getTypeBadgeStyle(type: string): string {
  let hash = 0
  for (let i = 0; i < type.length; i++) {
    hash = (hash << 5) - hash + type.charCodeAt(i)
    hash = hash & hash
  }
  const index = Math.abs(hash) % typeBadgeStyles.length
  return typeBadgeStyles[index]
}

export default async function EventsPage() {
  let specialEventsData: SpecialEvent[] = []
  let regularProgramsData: RegularProgram[] = []
  let error: string | null = null

  try {
    const [specialEventsResponse, regularProgramsResponse] = await Promise.all([
      getSpecialEvents(),
      getRegularPrograms(),
    ])

    if (specialEventsResponse.success) {
      specialEventsData = (specialEventsResponse.data || []).filter((event) => event.published)
    } else {
      error = specialEventsResponse.error || 'Failed to load special events'
    }

    if (regularProgramsResponse.success) {
      regularProgramsData = (regularProgramsResponse.data || []).filter((program) => program.active)
    } else if (!error) {
      error = regularProgramsResponse.error || 'Failed to load regular programs'
    }
  } catch (err) {
    console.error('Error fetching events data:', err)
    error = 'Unable to connect to server. Please try again later.'
  }

  const transformedSpecialEvents = specialEventsData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((event) => ({
      id: event.id,
      title: event.title || 'Untitled Event',
      type: event.type || 'Event',
      description: event.description || 'Join us for this special event.',
      date: formatDate(event.date),
      rawDate: event.date,
      time: formatTimeForDisplay(event.startTime, event.endTime),
      location: event.location || 'Main Sanctuary',
    }))

  const transformedRegularPrograms = regularProgramsData.map((program) => ({
    id: program.id,
    title: program.title || 'Untitled Program',
    type: program.type || 'Program',
    description: program.description || 'Regular gathering for spiritual growth.',
    day: program.day || 'TBD',
    frequency: program.frequency || 'Weekly',
    time: program.time || 'TBD',
    location: program.location || 'Main Sanctuary',
  }))

  return (
    <div className="min-h-screen bg-white">
      <EventsHero />
      
      {/* Geometric Background Pattern */}
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="events-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="#000000"/>
                <path d="M0 50 L100 50 M50 0 L50 100" stroke="#000000" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#events-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          {error ? (
            <div className="text-center py-20 border-4 border-black p-12">
              <p className="text-3xl font-black text-black mb-4 uppercase tracking-wide">Unable to load events</p>
              <p className="text-gray-700 text-lg">{error}</p>
            </div>
          ) : (
            <>
              {/* Regular Programs Section */}
              <section className="mb-32">
                <div className="mb-12">
                  <div className="w-24 h-1 bg-black mb-6"></div>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                    Regular<br />
                    <span className="italic">Programs</span>
                  </h2>
                </div>

                <div className="border-4 border-black bg-white overflow-hidden">
                  {/* Mobile scroll hint */}
                  <div className="md:hidden px-6 py-4 bg-black text-white text-sm font-bold text-center uppercase tracking-wider">
                    ← Scroll to see more →
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-black text-white">
                        <tr>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Type</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Description</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Day</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Frequency</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">Time & Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black">
                        {transformedRegularPrograms.length > 0 ? (
                          transformedRegularPrograms.map((program, index) => (
                            <tr key={program.id} className={`hover:bg-black hover:text-white transition-all duration-300 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-6 py-6 border-r-2 border-gray-200 group-hover:border-white/20">
                                <span className={`inline-block px-4 py-2 text-xs font-black uppercase tracking-wide border-2 ${getTypeBadgeStyle(program.type)}`}>
                                  {program.type}
                                </span>
                              </td>
                              <td className="px-6 py-6 border-r-2 border-gray-200 group-hover:border-white/20">
                                <div>
                                  <h3 className="font-black text-lg mb-2 uppercase tracking-wide">{program.title}</h3>
                                  <p className="text-sm leading-relaxed text-gray-700 group-hover:text-gray-300">{program.description}</p>
                                </div>
                              </td>
                              <td className="px-6 py-6 font-bold border-r-2 border-gray-200 group-hover:border-white/20">{program.day}</td>
                              <td className="px-6 py-6 font-bold border-r-2 border-gray-200 group-hover:border-white/20">{program.frequency}</td>
                              <td className="px-6 py-6 text-sm">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-black group-hover:bg-white flex items-center justify-center transition-all">
                                      <Clock size={14} className="text-white group-hover:text-black transition-all" />
                                    </div>
                                    <span className="font-medium">{program.time}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-black group-hover:bg-white flex items-center justify-center transition-all">
                                      <MapPin size={14} className="text-white group-hover:text-black transition-all" />
                                    </div>
                                    <span className="font-medium">{program.location}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-bold uppercase tracking-wide">
                              No regular programs scheduled at this time.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Special Events Section */}
              <section>
                <div className="mb-12">
                  <div className="w-24 h-1 bg-black mb-6"></div>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                    Special<br />
                    <span className="italic">Events</span>
                  </h2>
                </div>

                <div className="border-4 border-black bg-white overflow-hidden">
                  {/* Mobile scroll hint */}
                  <div className="md:hidden px-6 py-4 bg-black text-white text-sm font-bold text-center uppercase tracking-wider">
                    ← Scroll to see more →
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-black text-white">
                        <tr>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Title</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Type</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Description</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest border-r-2 border-white/20">Date</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">Time & Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black">
                        {transformedSpecialEvents.length > 0 ? (
                          transformedSpecialEvents.map((event, index) => (
                            <tr key={event.id} className={`hover:bg-black hover:text-white transition-all duration-300 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-6 py-6 font-black text-lg uppercase tracking-wide border-r-2 border-gray-200 group-hover:border-white/20">{event.title}</td>
                              <td className="px-6 py-6 border-r-2 border-gray-200 group-hover:border-white/20">
                                <span className={`inline-block px-4 py-2 text-xs font-black uppercase tracking-wide border-2 ${getTypeBadgeStyle(event.type)}`}>
                                  {event.type}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-sm leading-relaxed text-gray-700 group-hover:text-gray-300 border-r-2 border-gray-200 group-hover:border-white/20">{event.description}</td>
                              <td className="px-6 py-6 font-bold border-r-2 border-gray-200 group-hover:border-white/20">{event.date}</td>
                              <td className="px-6 py-6 text-sm">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-black group-hover:bg-white flex items-center justify-center transition-all">
                                      <Clock size={14} className="text-white group-hover:text-black transition-all" />
                                    </div>
                                    <span className="font-medium">{event.time}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-black group-hover:bg-white flex items-center justify-center transition-all">
                                      <MapPin size={14} className="text-white group-hover:text-black transition-all" />
                                    </div>
                                    <span className="font-medium">{event.location}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-bold uppercase tracking-wide">
                              No upcoming special events at this time.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Export Calendar Button */}
                <div className="mt-12 flex justify-end">
                  <CalendarExportButton
                    specialEvents={transformedSpecialEvents}
                    regularPrograms={transformedRegularPrograms}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}