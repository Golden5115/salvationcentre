/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import Image from 'next/image'
import { LeadershipSection } from '@/components/ui/LeadershipSection'

export const metadata: Metadata = {
  title: 'About Us - RCCG Salvation Centre | Our Mission & Vision',
  description: 'Learn about RCCG Salvation Centre - our mission, vision, and commitment to spreading the gospel and transforming lives through Christ.',
  openGraph: {
    title: 'About Us - RCCG Salvation Centre',
    description: 'Discover our church\'s story, mission, and impact',
    type: 'website',
    url: 'https://rccgsalvationcentre.com/about',
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-black">
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
                 <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/90 to-black/95 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-30">
          <div className="text-center">
            <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="text-white font-bold uppercase tracking-widest text-xs">About</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              RCCG<br />
              <span className="italic font-light">Salvation Centre</span>
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto font-light">
              A faith-filled community dedicated to worship, spiritual growth, and transformation in Jesus Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-white">
        {/* Our Story */}
        <div className="py-24 md:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <div className="w-20 h-1 bg-black mb-6"></div>
                  <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
                    Our<br />
                    <span className="italic">Story</span>
                  </h2>
                </div>
                <div className="space-y-6 text-lg leading-relaxed text-gray-800 border-l-4 border-black pl-8">
                  <p className="font-medium">
                    RCCG Salvation Centre is part of the Redeemed Christian Church of God (RCCG), a global movement established to spread the gospel and transform lives through the power of Christ.
                  </p>
                  <p>
                    Our congregation is dedicated to creating an environment where all are welcome to experience the love, grace, and truth of Jesus Christ in authentic community.
                  </p>
                  <p>
                    We believe in the transformative power of faith, the importance of genuine community, and the sacred call to serve others with compassion, integrity, and excellence.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 border-4 border-black"></div>
                <div className="relative overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg"
                    alt="Our Community at Worship"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover grayscale"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-20 md:py-32 relative overflow-hidden bg-linear-to-b from-white via-[#F9FAFB] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-linear-to-br from-white to-white/80 rounded-2xl p-12 border-2 border-gray-300 shadow-lg backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-400 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-black rounded-full opacity-10"></div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 relative z-10">Our Mission</h3>
                  <p className="text-lg leading-relaxed text-gray-700 relative z-10">
                    To spread the gospel of Jesus Christ, nurture spiritual growth, and empower our community to live out their faith with purpose, integrity, and transformative love.
                  </p>
                </div>
              </div>
              <div className="bg-linear-to-br from-gray-50/50 to-gray-100/30 rounded-2xl p-12 border-2 border-gray-300 shadow-lg backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                  <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gray-400 rounded-full opacity-10"></div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 relative z-10">Our Vision</h3>
                  <p className="text-lg leading-relaxed text-gray-700 relative z-10">
                    To be a beacon of hope and spiritual transformation in our community, where people experience God's grace, grow in faith, and serve others with compassion and excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="py-20 md:py-32 relative overflow-hidden bg-white">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="values-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="3" fill="#000000"/>
                  <circle cx="20" cy="20" r="2" fill="#666666"/>
                  <circle cx="80" cy="20" r="2" fill="#666666"/>
                  <circle cx="20" cy="80" r="2" fill="#666666"/>
                  <circle cx="80" cy="80" r="2" fill="#666666"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#values-pattern)" />
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Faith & Worship', 
                  description: 'We believe in the transformative power of faith in Jesus Christ and worship that flows from authentic hearts.',
                },
                { 
                  title: 'Community & Love', 
                  description: 'We foster an inclusive, welcoming community where all are valued, loved unconditionally, and belong.',
                },
                { 
                  title: 'Service & Excellence', 
                  description: 'We serve others with integrity, compassion, and a commitment to making a positive eternal impact.',
                },
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-linear-to-br from-gray-50/50 to-gray-100/30 rounded-2xl p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-200 backdrop-blur-sm"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-gray-600 to-black flex items-center justify-center text-white font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{value.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <LeadershipSection />

        {/* Connect Section */}
        <div className="py-24 md:py-32 relative overflow-hidden bg-white">
          {/* Geometric Background Pattern */}
          <div className="absolute inset-0 opacity-[0.04]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="connect-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  {/* Cross pattern */}
                  <path d="M60 0 L60 120 M0 60 L120 60" stroke="#000000" strokeWidth="1.5" fill="none"/>
                  {/* Diagonal lines */}
                  <path d="M0 0 L120 120 M120 0 L0 120" stroke="#000000" strokeWidth="0.5" fill="none" opacity="0.3"/>
                  {/* Corner squares */}
                  <rect x="0" y="0" width="15" height="15" fill="#000000" opacity="0.8"/>
                  <rect x="105" y="0" width="15" height="15" fill="#000000" opacity="0.8"/>
                  <rect x="0" y="105" width="15" height="15" fill="#000000" opacity="0.8"/>
                  <rect x="105" y="105" width="15" height="15" fill="#000000" opacity="0.8"/>
                  {/* Center circle */}
                  <circle cx="60" cy="60" r="8" fill="#000000" opacity="0.6"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#connect-pattern)" />
            </svg>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-black opacity-20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-black opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-black opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-black opacity-20"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <div className="w-20 h-1 bg-black mb-8"></div>
                <h2 className="text-5xl font-black mb-12 tracking-tight text-black">Connect<br />With Us</h2>
                
                <div className="space-y-10">
                  <div className="border-l-4 border-black pl-6">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-3 text-gray-600">Email</h3>
                    <a 
                      href="mailto:rccgsalvationcentre01@gmail.com" 
                      className="text-2xl font-bold hover:opacity-70 transition-opacity block text-black"
                    >
                      rccgsalvationcentre01@gmail.com
                    </a>
                  </div>
                  
                  <div className="border-l-4 border-black pl-6">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-4 text-gray-600">Follow Us</h3>
                    <div className="space-y-3">
                      <a 
                        href="https://www.facebook.com/share/15kREEhJDG/?mibextid=wwXIfr" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block text-xl font-bold hover:opacity-70 transition-opacity text-black"
                      >
                        → Facebook
                      </a>
                      <a 
                        href="https://www.instagram.com/rccg_salvation_centre" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block text-xl font-bold hover:opacity-70 transition-opacity text-black"
                      >
                        → Instagram
                      </a>
                      <a 
                        href="https://youtube.com/@rccgsalvationcentre289" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block text-xl font-bold hover:opacity-70 transition-opacity text-black"
                      >
                        → YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black text-white p-12 border-4 border-black relative">
                {/* Decorative corner accents on the card */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-white"></div>
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-16 h-16 bg-white flex items-center justify-center">
                    <span className="text-black text-3xl font-black">†</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase">Service Times</h3>
                </div>
                
                <div className="space-y-8 relative z-10">
                  {[
                    { title: 'Bible Study', time: 'Tuesdays 6:30PM - 8:00PM' },
                    { title: 'Online Vigil', time: 'Wednesdays 11PM - 1AM' },
                    { title: 'Faith Clinic', time: 'Thursdays 6:30PM - 8:00PM' },
                    { title: 'Beginning with Jesus', time: '1st of Every Month 6AM - 7AM' },
                  ].map((service, index) => (
                    <div key={index} className="border-b-2 border-white pb-6 last:border-0">
                      <p className="font-black text-lg mb-2 uppercase tracking-wide">{service.title}</p>
                      <p className="text-gray-300 font-medium">{service.time}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 relative z-10">
                  <a 
                    href="/events" 
                    className="inline-block bg-white text-black px-10 py-5 font-black uppercase tracking-wider hover:bg-gray-200 transition-all border-4 border-white hover:border-gray-200"
                  >
                    View Full Schedule →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}