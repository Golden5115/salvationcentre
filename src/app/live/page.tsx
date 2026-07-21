/* eslint-disable @typescript-eslint/no-unused-vars */
// app/live/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Calendar, HelpCircle, Radio, MapPin } from 'lucide-react'
import { SermonCard } from '@/components/sermons/SermonCard'

export const metadata: Metadata = {
  title: 'Live Streaming - RCCG Salvation Centre | Watch Our Services Online',
  description: 'Watch live Sunday services, messages, and events from RCCG Salvation Centre. Join our online community and experience worship from anywhere.',
  openGraph: {
    title: 'Live Streaming - RCCG Salvation Centre',
    description: 'Join us live for inspiring worship and messages every Sunday',
    type: 'website',
    url: 'https://rccgsalvationcentre.com/live',
  },
}

// Never statically prerender — always fetch fresh at request time,
// and never let a backend outage take the build down with it.
export const dynamic = 'force-dynamic'

// Server component that fetches data
async function getLatestSermon() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000) // 5s ceiling

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/sermons/latest`,
      { cache: 'no-store', signal: controller.signal }
    );

    if (!res.ok) {
      console.error('Failed to fetch latest sermon:', res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Sermon fetch timed out — backend likely unreachable');
    } else {
      console.error('Error fetching latest sermon:', error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Helper function to format date - matches events page format
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date TBD';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Date TBD';
  }
}

// Type badge styles - matches events page
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

export default async function LivePage() {
  // Fetch the actual latest sermon
  const latestSermon = await getLatestSermon();
  
  // Fallback data if no sermon is found
  const liveSermon = latestSermon ? {
    id: latestSermon.id,
    title: latestSermon.title || 'Latest Message',
    pastor: latestSermon.pastor || 'Speaker',
    service: latestSermon.service || 'Service',
    type: 'Sermon',
    date: formatDate(latestSermon.date),
    duration: latestSermon.duration || '',
    description: latestSermon.description || 'Watch our latest inspiring message',
    youtubeId: latestSermon.youtubeId
  } : {
    id: 999,
    title: 'Sunday Morning Worship Service',
    pastor: 'Pastor Muyiwa Akindele',
    service: 'Sunday Service',
    type: 'Live Service',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    duration: 'Live',
    description: 'Join us right now for a powerful time of worship, prayer, and an inspiring message from God\'s Word. You are welcome in Jesus\' name!',
    youtubeId: 'YOUR_LIVE_VIDEO_ID_HERE',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — now matches HeroCarousel's type scale */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg"
            alt="RCCG Salvation Centre"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/80 z-10" />
        </div>

        <div className="absolute inset-0 z-20 opacity-[0.02] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="live-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="#FFFFFF"/>
                <path d="M0 50 L100 50 M50 0 L50 100" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#live-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-30 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-none tracking-tight">
            Watch Live
          </h1>
          <p
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto font-normal leading-relaxed"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Join our global family for real-time worship, powerful preaching, and life-changing prayer
          </p>

          {latestSermon && (
            <div className="mt-8 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-6 py-2.5">
              <span className="w-2 h-2 bg-[#df2020] rounded-full animate-pulse" />
              <span className="text-white font-semibold uppercase tracking-[0.1em] text-xs">
                Latest: {latestSermon.title}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
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
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Live Player Section */}
            <div className="lg:col-span-2 space-y-12">
              <div className="mb-12">
                <div className="w-16 h-1 bg-[#df2020] mb-6"></div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-none mb-4">
                  Live Streaming
                </h2>
              </div>

              <div className="border-4 border-black bg-white overflow-hidden">
                <SermonCard sermon={liveSermon} />
              </div>

              <div className="border-4 border-black bg-white p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-4 h-4 bg-[#df2020] rounded-full animate-pulse" />
                  <h3 className="text-2xl font-bold uppercase tracking-wide text-black">
                    {latestSermon ? 'Latest Message' : 'Live Now'}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-lg uppercase tracking-wide mb-2">{liveSermon.title}</h4>
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <span className="px-3 py-1 bg-black text-white border-2 border-black">
                        {liveSermon.service}
                      </span>
                      <span className="text-gray-700">•</span>
                      <span className="text-gray-700">{liveSermon.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black flex items-center justify-center">
                      <Radio size={14} className="text-white" />
                    </div>
                    <span className="font-bold uppercase tracking-wider text-sm">
                      {latestSermon ? 'WATCH LATEST MESSAGE' : 'STREAMING LIVE NOW'}
                    </span>
                  </div>
                  
                  <p
                    className="text-gray-700 leading-relaxed border-t-2 border-black pt-6 mt-6"
                    style={{ fontFamily: 'var(--font-lora)' }}
                  >
                    {liveSermon.description}
                  </p>
                  
                  {latestSermon && (
                    <div className="mt-8 pt-8 border-t-2 border-gray-200">
                      <h5 className="font-bold uppercase tracking-wide text-sm mb-4">MESSAGE DETAILS:</h5>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <span className="text-gray-600 text-sm font-medium">SPEAKER:</span>
                          <p className="font-bold text-black">{latestSermon.pastor}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm font-medium">SERVICE TYPE:</span>
                          <p className="font-bold text-black">{latestSermon.service}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600 text-sm font-medium">ORIGINALLY RECORDED:</span>
                          <p className="font-bold text-black">{formatDate(latestSermon.date)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="border-4 border-black bg-white p-8">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-black mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  Service Schedule
                </h3>
                
                <div className="space-y-6">
                  <div className="pb-6 border-b-2 border-black">
                    <p className="font-bold uppercase tracking-wider text-sm mb-2">Sunday Morning</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-black flex items-center justify-center">
                          <Clock size={12} className="text-white" />
                        </div>
                        <span className="font-medium">9:00 AM – 12:00 PM EST</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-black flex items-center justify-center">
                          <MapPin size={12} className="text-white" />
                        </div>
                        <span className="font-medium">Main Sanctuary</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#df2020] mt-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#df2020] rounded-full animate-pulse" /> 
                      LIVE NOW
                    </p>
                  </div>
                  
                  <div className="pb-6 border-b-2 border-black">
                    <p className="font-bold uppercase tracking-wider text-sm mb-2">Wednesday Bible Study</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-black flex items-center justify-center">
                          <Clock size={12} className="text-white" />
                        </div>
                        <span className="font-medium">7:00 PM – 9:00 PM EST</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-black flex items-center justify-center">
                          <MapPin size={12} className="text-white" />
                        </div>
                        <span className="font-medium">Prayer Chapel</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-bold uppercase tracking-wider text-sm mb-2">All Services Archived</p>
                    <p className="text-sm font-medium text-gray-700">Watch anytime on demand</p>
                  </div>
                </div>
              </div>

              <div className="border-4 border-black bg-white p-8">
                <h3 className="text-lg font-bold uppercase tracking-wide text-black mb-4 flex items-center gap-3">
                  <div className="w-6 h-6 bg-black flex items-center justify-center">
                    <HelpCircle size={14} className="text-white" />
                  </div>
                  Having Issues?
                </h3>
                
                <p
                  className="text-sm text-gray-700 mb-6 leading-relaxed"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  Try refreshing the page or checking your internet connection. If problems persist, contact our support team.
                </p>
                
                <a
                  href="mailto:support@rccgsalvationcentre.com"
                  className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:underline"
                >
                  <span>CONTACT SUPPORT</span>
                  <span>→</span>
                </a>
              </div>

              <div className="border-4 border-black bg-white p-8">
                <h3 className="text-lg font-bold uppercase tracking-wide text-black mb-4">Stream Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Live Stream</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-bold uppercase">ACTIVE</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Video Quality</span>
                    <span className="text-sm font-bold uppercase">HD</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Viewers Online</span>
                    <span className="text-sm font-bold uppercase">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}