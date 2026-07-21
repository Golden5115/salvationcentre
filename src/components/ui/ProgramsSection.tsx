import Link from 'next/link'
import Image from 'next/image'

const programs = [
  { title: 'Bible Study', time: 'Tuesdays · 6:30PM – 8:00PM', desc: 'Deep scriptural exploration and discussion' },
  { title: 'Online Vigil', time: 'Wednesdays · 11PM – 1AM', desc: 'Night prayer and spiritual communion' },
  { title: 'Faith Clinic', time: 'Thursdays · 6:30PM – 8:00PM', desc: 'Prayer, healing, and spiritual renewal' },
  { title: 'Beginning with Jesus', time: '1st of Every Month · 6AM – 7AM', desc: 'Monthly dawn prayer and dedication' },
]

const marqueePrograms = [...programs, ...programs]

export function ProgramsSection() {
  return (
    <section className="relative py-14 md:py-20 overflow-hidden bg-gray-950">
      <style>{`
        @keyframes programs-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .programs-marquee-track {
          animation: programs-marquee 32s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .programs-marquee-track {
            animation: none;
          }
        }

        /* 3D card effect */
        .program-card-wrap {
          perspective: 1000px;
        }
        .program-card {
          position: relative;
          overflow: hidden;
          transform: rotateX(0deg) rotateY(0deg) translateY(0) scale(1);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.5s ease, border-color 0.5s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .program-card:hover {
          transform: rotateX(7deg) rotateY(-9deg) translateY(-10px) scale(1.045);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.65), 0 10px 20px -5px rgba(0,0,0,0.4);
        }
        .program-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%);
          transform: translateX(-150%);
          transition: transform 0.7s ease;
          pointer-events: none;
        }
        .program-card:hover::after {
          transform: translateX(150%);
        }
        .program-card > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dxlyd19av/image/upload/v1777725810/WhatsApp_Image_2026-04-07_at_08.11.49_hdxxd3.jpg"
          alt="Church background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/75 z-10" />
      </div>

      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 z-[5] opacity-[0.06]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="programs-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
              <path d="M75 15 L75 135 M15 75 L135 75" stroke="#ffffff" strokeWidth="1" fill="none" strokeOpacity="0.4" />
              <path d="M75 50 L100 75 L75 100 L50 75 Z" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#programs-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold !text-white tracking-tight mb-3">
          Our Programs &amp; Activities
        </h2>
        <p className="text-lg text-gray-300 font-light mb-12">
          Multiple ways to grow your faith
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative z-10 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-20 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-20 bg-gradient-to-l from-black/80 to-transparent" />

        <div className="programs-marquee-track flex w-max gap-6 px-6 py-6">
          {marqueePrograms.map((prog, i) => (
            <div key={i} className="program-card-wrap shrink-0" aria-hidden={i >= programs.length}>
              <div className="program-card w-72 md:w-80 text-left bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-accent/50">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{prog.title}</h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-[0.08em] mb-3">
                  {prog.time}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">{prog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12 relative z-10">
        <Link
          href="/events"
          className="inline-block bg-white text-primary px-10 py-4 text-sm font-bold uppercase tracking-[0.08em] rounded-full hover:bg-accent hover:text-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(230,57,70,0.4)]"
        >
          View Full Schedule
        </Link>
      </div>
    </section>
  )
}