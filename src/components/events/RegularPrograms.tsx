// components/events/RegularPrograms.tsx
import { Calendar, Clock, MapPin } from 'lucide-react'


interface Program {
  id: number;
  title: string;
  type: string;
  description: string;
  day: string;
  time: string;
  location: string;
  calendarLink: string;
  featured?: boolean;
}

export default function RegularPrograms({ programs }: { programs: Program[] }) {
  if (!programs || programs.length === 0) {
    return (
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Regular Programs & Activities
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Weekly opportunities for spiritual growth and community connection
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No regular programs scheduled at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
          Regular Programs & Activities
        </h2>
        <p className="text-lg text-muted max-w-3xl mx-auto">
          Weekly opportunities for spiritual growth and community connection
        </p>
      </div>

      <div className="space-y-8">
        {programs.map((program: Program) => (
          <div
            key={program.id}
            className={`bg-white border-l-4 rounded-r-lg shadow-sm hover:shadow-lg transition-all duration-300 ${
              program.featured ? 'border-l-primary' : 'border-l-transparent'
            }`}
          >
            <div className="p-8">
              <div className="grid md:grid-cols-6 gap-8 items-start">
                {/* Left: Title + Description */}
                <div className="md:col-span-2">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 tracking-wider ${
                      program.type === 'Service'
                        ? 'bg-primary text-white'
                        : program.type === 'Prayer'
                        ? 'bg-dark text-light'
                        : program.type === 'Study'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {program.type.toUpperCase()}
                  </span>

                  <h3 className="text-2xl font-bold text-dark mb-3">
                    {program.title}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Day */}
                <div className="flex items-center gap-4">
                  <Calendar size={24} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted">Day</p>
                    <p className="font-bold text-dark text-lg">{program.day || 'TBD'}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-4">
                  <Clock size={24} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted">Time</p>
                    <p className="font-bold text-dark text-lg">{program.time || 'TBD'}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <MapPin size={24} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted">Location</p>
                    <p className="font-bold text-dark text-lg">{program.location}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="md:col-span-1 flex justify-end items-start">
                  <a
                    href={program.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-dark transition-all hover:scale-105 shadow-md"
                  >
                    <Calendar size={18} />
                    Add to Calendar
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}