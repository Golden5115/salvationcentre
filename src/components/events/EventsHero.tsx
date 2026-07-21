import Image from 'next/image'

export default function EventsHero() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg"
          alt="RCCG Salvation Centre"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/*  Sermons & Programs */}
        <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/90 to-black/95 z-10" />
      </div>

      {/*Subtle geometric pattern*/}
      <div className="absolute inset-0 z-20 opacity-[0.08]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="events-hero-pattern"
              x="0"
              y="0"
              width="150"
              height="150"
              patternUnits="userSpaceOnUse"
            >
              {/* Faint cross */}
              <path
                d="M75 15 L75 135 M15 75 L135 75"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                fill="none"
                strokeOpacity="0.5"
              />
              {/* Subtle diamond */}
              <path
                d="M75 50 L100 75 L75 100 L50 75 Z"
                fill="#FFFFFF"
                fillOpacity="0.15"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#events-hero-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-30">
        <div className="text-center">
          <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="text-white font-bold uppercase tracking-widest text-xs">Events</span>
            </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Church Events & Calendar
          </h1>
          <p className="text-2xl text-gray-200 max-w-3xl mx-auto">
            Regular programs and special events updated by church administration
          </p>
        </div>
      </div>
    </section>
  )
}