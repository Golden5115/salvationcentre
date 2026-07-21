/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { getSpecialEvents } from '@/lib/api/special-events'
import type { SpecialEvent } from '@/lib/types/special-event'
import { format, addDays } from 'date-fns'

function generateGoogleCalendarLink(event: SpecialEvent): string {
  const title = encodeURIComponent(event.title || 'Church Event')
  const description = event.description ? encodeURIComponent(event.description) : ''
  const location = event.location ? encodeURIComponent(event.location) : ''

  let dates = ''

  if (event.startTime && event.endTime) {
    const dateStr = event.date.replace(/-/g, '')
    const start = `${dateStr}T${event.startTime.replace(':', '')}00`
    const end = `${dateStr}T${event.endTime.replace(':', '')}00`
    dates = `${start}/${end}`
  } else {
    const startDate = event.date.replace(/-/g, '')
    const endDate = format(addDays(new Date(event.date), 1), 'yyyyMMdd')
    dates = `${startDate}/${endDate}`
  }

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${description}&location=${location}&sf=true&output=xml`
}

export default function SpecialEvents() {
  const [events, setEvents] = useState<SpecialEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)

        const response = await getSpecialEvents()

        if (response.success && response.data) {
          const publishedEvents = response.data
            .filter((event: SpecialEvent) => event.published)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

          setEvents(publishedEvents)
        } else {
          setError(response.error || 'Failed to load events')
        }
      } catch (err) {
        console.error('Error fetching special events:', err)
        setError('Unable to load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const hasEvents = events.length > 0

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Beautiful Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-light via-white to-light/70"></div>
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/12 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dark/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-primary/8 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, #0C1844 1px, transparent 1px),
                linear-gradient(to bottom, #0C1844 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div 
          className="absolute inset-0 opacity-[0.06]" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C80036 1.5px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-teko font-bold text-dark mb-4 tracking-tight">
            Upcoming Special Events
          </h2>
          <p className="text-xl md:text-2xl text-dark/80 font-medium max-w-3xl mx-auto">
            Mark these important dates on your calendar
          </p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-xl text-gray-600">Loading events...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
            <p className="text-gray-500 mt-2">Please refresh the page or try again later.</p>
          </div>
        )}

        {!loading && !error && !hasEvents && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No special events scheduled at this time.</p>
            <p className="text-gray-500 mt-2">Check back soon for updates!</p>
          </div>
        )}

        {!loading && !error && hasEvents && (
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {events.map((event) => {
              let formattedDate = 'Date TBD'
              try {
                const dateObj = new Date(event.date)
                if (!isNaN(dateObj.getTime())) {
                  formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy')
                }
              } catch (_) {}

              const timeDisplay =
                event.startTime || event.endTime
                  ? `${event.startTime || 'TBD'} ${event.endTime ? `– ${event.endTime}` : ''}`
                  : 'Time TBD'

              return (
                <div
                  key={event.id}
                  className="bg-white/90 backdrop-blur-md border border-dark/5 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl md:text-3xl font-teko font-bold text-dark line-clamp-2">
                      {event.title}
                    </h3>
                    <span className="text-sm uppercase tracking-wider text-primary/80 font-semibold mt-1">
                      {event.type}
                    </span>
                  </div>

                  <div className="space-y-5 mb-8">
                    <div className="flex items-center gap-4">
                      <Calendar size={24} className="text-primary" />
                      <span className="text-lg font-semibold text-dark">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Clock size={24} className="text-primary" />
                      <span className="text-lg font-semibold text-dark">{timeDisplay}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-4">
                        <MapPin size={24} className="text-primary" />
                        <span className="text-lg font-semibold text-dark">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-dark/75 text-base leading-relaxed mb-10">
                      {event.description}
                    </p>
                  )}

                  <a
                    href={generateGoogleCalendarLink(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-5 bg-primary text-white font-teko font-bold text-xl rounded-xl hover:bg-dark transition-all hover:scale-105 shadow-lg"
                  >
                    <Calendar size={22} />
                    Add to Google Calendar
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}