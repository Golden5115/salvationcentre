// components/events/CalendarDownload.tsx
import Link from 'next/link'

export default function CalendarDownload() {
  return (
    <section className="relative mt-32 md:mt-40 overflow-hidden">
      {/*Special Events & Live Streaming */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-light via-white to-light/70"></div>
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/12 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dark/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-primary/8 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-teko font-bold text-dark mb-6 tracking-tight">
          Download Full Calendar
        </h2>
        
        <p className="text-xl text-dark/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          Download our complete church calendar in ICS format and sync it with Google Calendar, Apple Calendar, Outlook, or any app you use.
        </p>

        
        <Link
          href="/calendar.ics" // Replace with your real ICS file URL when ready
          download
          className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-white font-teko font-bold text-2xl rounded-xl hover:bg-dark transition-all hover:scale-105 shadow-2xl"
        >
          Download ICS File
        </Link>

        <p className="mt-8 text-sm text-dark/60">
          Works instantly with Google Calendar • Apple Calendar • Outlook • Mobile • Tablet
        </p>
      </div>
    </section>
  )
}