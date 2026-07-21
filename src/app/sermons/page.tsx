/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Play, Calendar, User, Clock, Youtube } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { getPublishedSermons } from '@/lib/api/sermons'

interface Sermon {
  id: number
  title: string
  pastor: string
  service: string
  date: string
  youtubeId: string
  duration?: string
  description?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [backendDown, setBackendDown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedPastor, setSelectedPastor] = useState('all')

  useEffect(() => {
    fetchSermons()
  }, [])

  const filterSermons = useCallback(() => {
    let filtered = sermons

    if (searchTerm) {
      filtered = filtered.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.pastor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(sermon => sermon.service === selectedService)
    }

    if (selectedPastor !== 'all') {
      filtered = filtered.filter(sermon => sermon.pastor === selectedPastor)
    }

    setFilteredSermons(filtered)
  }, [searchTerm, selectedService, selectedPastor, sermons])

  useEffect(() => {
    filterSermons()
  }, [filterSermons])

  const fetchSermons = async () => {
    setLoading(true)
    setBackendDown(false)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        setBackendDown(true)
        setLoading(false)
        return
      }

      
      const response = await Promise.race([
        getPublishedSermons(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 5000)
        ),
      ])

      if (response.success && response.data) {
        const sermonsData = response.data as any
        const sermonsArray = Array.isArray(sermonsData)
          ? sermonsData
          : sermonsData.data || sermonsData.sermons || []

        const sortedSermons = [...sermonsArray].sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          } catch {
            return 0
          }
        })

        setSermons(sortedSermons)
        setFilteredSermons(sortedSermons)
      } else {
        setBackendDown(true)
      }
    } catch (error: any) {
      console.error('Sermons backend unreachable:', error)
      setBackendDown(true)
    } finally {
      setLoading(false)
    }
  }

  const serviceOptions = ['all', ...Array.from(new Set(sermons.map(s => s.service).filter(Boolean) as string[]))]
  const pastorOptions = ['all', ...Array.from(new Set(sermons.map(s => s.pastor)))]

  const handlePlaySermon = (sermon: Sermon) => {
    if (sermon.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${sermon.youtubeId}`, '_blank', 'noopener,noreferrer')
    } else {
      toast.info('Video not available for this sermon')
    }
  }

  const getYoutubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  const formatDuration = (duration?: string) => {
    if (!duration) return ''
    const parts = duration.split(':')
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10)
      const minutes = parseInt(parts[1], 10)
      return `${hours}h ${minutes}m`
    } else if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10)
      const seconds = parseInt(parts[1], 10)
      return `${minutes}m ${seconds}s`
    }
    return duration
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Banner ── */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg"
            alt="RCCG Salvation Centre Sermons"
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
              <span className="text-white font-bold uppercase tracking-widest text-xs">Sermons</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Sermons<br />
              <span className="italic font-light">&amp; Teachings</span>
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto font-light">
              Explore our library of biblical teachings, messages, and spiritual guidance to nourish your faith journey.
            </p>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Section ── */}
      <div className="py-16 md:py-24 bg-linear-to-b from-white via-[#F9FAFB] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="w-20 h-1 bg-black mb-6"></div>
              <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
                Explore<br />
                <span className="italic">Messages</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search sermons by title, pastor, or description..."
                  className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  disabled={backendDown}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-3">
                    <Filter className="inline w-4 h-4 mr-2" />
                    Service
                  </label>
                  <select
                    className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    value={selectedService}
                    onChange={e => setSelectedService(e.target.value)}
                    disabled={backendDown}
                  >
                    {serviceOptions.map(service => (
                      <option key={service} value={service}>
                        {service === 'all' ? 'All Services' : service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-3">
                    <User className="inline w-4 h-4 mr-2" />
                    Pastor
                  </label>
                  <select
                    className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    value={selectedPastor}
                    onChange={e => setSelectedPastor(e.target.value)}
                    disabled={backendDown}
                  >
                    {pastorOptions.map(pastor => (
                      <option key={pastor} value={pastor}>
                        {pastor === 'all' ? 'All Pastors' : pastor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {!backendDown && (
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-700 font-medium">
                Showing <span className="font-black text-black">{filteredSermons.length}</span> sermons
              </p>
              {filteredSermons.length === 0 && !loading && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedService('all')
                    setSelectedPastor('all')
                  }}
                  className="text-black font-bold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Sermons Grid / Coming Soon / Loading ── */}
      <div className="py-16 md:py-24 bg-white relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sermons-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="3" fill="#000000"/>
                <circle cx="20" cy="20" r="2" fill="#666666"/>
                <circle cx="80" cy="20" r="2" fill="#666666"/>
                <circle cx="20" cy="80" r="2" fill="#666666"/>
                <circle cx="80" cy="80" r="2" fill="#666666"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sermons-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Loading spinner */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
              <p className="mt-6 text-gray-600 font-medium">Loading sermons...</p>
            </div>
          )}

          {/* Coming Soon — backend unreachable */}
          {!loading && backendDown && (
            <div className="text-center py-28 px-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-black mb-8">
                <Clock className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Sermons Coming Soon
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                We&apos;re working on bringing our full sermon library online.
                In the meantime, you can watch all our messages directly on YouTube.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.youtube.com/@rccgsalvationcentre289"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-xl transition-all border-4 border-red-600 hover:border-red-700 shadow-md hover:shadow-lg"
                >
                  <Youtube className="w-5 h-5" />
                  Watch on YouTube
                </a>
                <button
                  onClick={fetchSermons}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent hover:bg-gray-100 text-black font-bold uppercase tracking-wider rounded-xl transition-all border-4 border-black"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty state — backend up but no results */}
          {!loading && !backendDown && filteredSermons.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block border-4 border-black p-8 mb-6">
                <Search className="w-16 h-16 text-black" />
              </div>
              <h3 className="text-3xl font-black mb-4">No sermons found</h3>
              <p className="text-gray-700 text-lg max-w-md mx-auto">
                No published sermons match your current filters or search term.<br /><br />
                Try different keywords or clear the filters.
              </p>
            </div>
          )}

          {/* Sermons grid */}
          {!loading && !backendDown && filteredSermons.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSermons.map(sermon => (
                  <div
                    key={sermon.id}
                    className="bg-linear-to-br from-gray-50/50 to-gray-100/30 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-200 backdrop-blur-sm group"
                  >
                    <div className="relative h-64 bg-gray-200 overflow-hidden">
                      {sermon.youtubeId ? (
                        <Image
                          src={getYoutubeThumbnail(sermon.youtubeId)}
                          alt={sermon.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={e => {
                            ;(e.target as HTMLImageElement).src =
                              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg'
                            ;(e.target as HTMLImageElement).onerror = null
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-600 to-black flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                      <button
                        onClick={() => handlePlaySermon(sermon)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>

                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                        <Youtube className="w-4 h-4" />
                        YouTube
                      </div>

                      {sermon.duration && (
                        <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-bold">
                          {formatDuration(sermon.duration)}
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      {sermon.service && (
                        <span className="bg-black text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                          {sermon.service}
                        </span>
                      )}

                      <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-black transition-colors mt-4">
                        {sermon.title}
                      </h3>

                      {sermon.description && (
                        <p className="text-gray-700 mb-6 line-clamp-2">{sermon.description}</p>
                      )}

                      <div className="space-y-4 border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-500" />
                          <span className="font-bold text-gray-900">{sermon.pastor}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">
                            {new Date(sermon.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {sermon.duration && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{formatDuration(sermon.duration)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button
                          onClick={() => handlePlaySermon(sermon)}
                          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 border-2 border-red-600 hover:border-red-700"
                        >
                          <Youtube className="w-5 h-5" />
                          Watch on YouTube
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured Sermon Banner */}
              <div className="mt-24 bg-black text-white rounded-3xl overflow-hidden border-4 border-black">
                <div className="grid md:grid-cols-2">
                  <div className="p-12 md:p-16">
                    <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6">
                      <span className="text-white font-bold uppercase tracking-widest text-xs">
                        Latest Message
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black mb-6">Featured Sermon</h3>
                    <p className="text-xl text-white/80 mb-10">
                      Watch our most recent message and be inspired by God&apos;s word.
                    </p>
                    {filteredSermons[0]?.youtubeId ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${filteredSermons[0].youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 font-black uppercase tracking-wider transition-all border-4 border-red-600 hover:border-red-700"
                      >
                        <Youtube className="w-6 h-6" />
                        Watch Latest Sermon →
                      </a>
                    ) : (
                      <button
                        onClick={() => handlePlaySermon(filteredSermons[0])}
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 font-black uppercase tracking-wider transition-all border-4 border-red-600 hover:border-red-700"
                      >
                        <Youtube className="w-6 h-6" />
                        Watch Latest Sermon →
                      </button>
                    )}
                  </div>
                  <div className="relative min-h-[300px] md:min-h-full">
                    <div className="absolute inset-0 bg-linear-to-r from-black via-black/95 to-transparent z-10 md:hidden"></div>
                    {filteredSermons[0]?.youtubeId ? (
                      <Image
                        src={getYoutubeThumbnail(filteredSermons[0].youtubeId)}
                        alt={filteredSermons[0].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={e => {
                          ;(e.target as HTMLImageElement).src =
                            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg'
                          ;(e.target as HTMLImageElement).onerror = null
                        }}
                      />
                    ) : (
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg"
                        alt="Featured Sermon"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Subscribe Section ── */}
      <div className="py-20 md:py-32 relative overflow-hidden bg-black min-h-[600px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxlyd19av/image/upload/v1769007761/Headphone_Aesthetic_HD_Wallpaper_for_PC_Laptops_usdl4x.jpg"
            alt="Aesthetic headphone background"
            fill
            className="object-cover brightness-75"
            quality={85}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/65 to-black/80 z-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-20 text-center">
          <div className="inline-block border-2 border-white/40 px-5 py-2 mb-8 backdrop-blur-sm rounded-full">
            <span className="text-white font-bold uppercase tracking-widest text-sm">Stay Connected</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Never Miss a Message
          </h2>

          <div className="w-24 h-1 bg-red-600 mx-auto mb-8 rounded-full"></div>

          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 font-light drop-shadow-md">
            Subscribe to our YouTube channel for notifications when new sermons are published.
          </p>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-8">
              <Youtube className="w-20 h-20 text-red-600 drop-shadow-lg" />

              <h3 className="text-3xl md:text-4xl font-black text-white">
                Subscribe on YouTube
              </h3>

              <p className="text-white/80 text-lg md:text-xl max-w-lg">
                Get notified immediately when we upload new sermons and teachings.
              </p>

              <a
                href="https://www.youtube.com/@rccgsalvationcentre289"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-10 py-6 bg-red-600 hover:bg-red-700 text-white text-xl font-black uppercase tracking-wider rounded-2xl transition-all duration-300 border-4 border-red-700 hover:border-red-800 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Youtube className="w-8 h-8" />
                Subscribe Now
                <span className="absolute -right-2 -top-2 h-5 w-5 animate-ping rounded-full bg-red-400 opacity-75"></span>
              </a>

              <p className="text-white/70 text-base">
                Turn on notifications 🔔 to never miss an upload
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}