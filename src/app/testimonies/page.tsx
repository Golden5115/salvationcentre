import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, ChevronRight, TrendingUp } from 'lucide-react'
import { getApprovedTestimonies } from '@/lib/api/testimonies'
import { TestimonyCard } from '@/components/testimonies/TestimonyCard'

export const metadata: Metadata = {
  title: 'Testimonies - RCCG Salvation Centre | Member Stories of Faith',
  description: 'Read inspiring testimonies from church members about their journey of faith, healing, and transformation at RCCG Salvation Centre.',
}

export default async function TestimoniesPage() {
  const testimonies = await getApprovedTestimonies()

  // Calculate stats
  const totalTestimonies = testimonies.length
  const recentTestimonies = testimonies.filter(t => {
    const date = new Date(t.submittedAt)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return date > monthAgo
  }).length

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-20 relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto px-6 relative z-30 text-center">
          <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold uppercase tracking-widest text-xs">Stories of Faith</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-none tracking-tight">
            Member Testimonies
          </h1>
          <div className="w-16 h-1 bg-[#df2020] mx-auto mb-6"></div>
          <p
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Real stories of God&apos;s grace, healing, and transformation
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="border-2 border-white/30 backdrop-blur-sm bg-white/5 px-6 py-4 min-w-40">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalTestimonies}</p>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Testimonies</p>
            </div>
            <div className="border-2 border-white/30 backdrop-blur-sm bg-white/5 px-6 py-4 min-w-40">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{recentTestimonies}</p>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">This Month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-white relative">

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          {/* Section Title */}
          <div className="mb-16">
            <div className="w-16 h-1 bg-[#df2020] mb-6"></div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-none mb-4">
              Recent Testimonies
            </h2>
            <p
              className="text-lg text-gray-700 font-normal leading-relaxed"
              style={{ fontFamily: 'var(--font-lora)' }}
            >
              Read inspiring stories from our community members
            </p>
          </div>

          {/* Testimonies Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonies.map((testimony) => (
              <TestimonyCard key={testimony.id} testimony={testimony} />
            ))}
          </div>

          {/* Empty State */}
          {testimonies.length === 0 && (
            <div className="text-center py-20 border-4 border-black p-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-black mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4 uppercase tracking-wide">No testimonies yet</h3>
              <p
                className="text-gray-700 mb-8 text-lg leading-relaxed"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                Be the first to share how God has worked in your life!
              </p>
              <Link
                href="/testimonies/submit"
                className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-all border-4 border-black hover:border-gray-800"
              >
                Share Your Story
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-24">
            <div className="bg-black text-white p-12 md:p-16 relative overflow-hidden border-4 border-black">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-white opacity-30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-white opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-white opacity-30"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-white opacity-30"></div>

              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="inline-block border-4 border-white px-6 py-2 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold uppercase tracking-widest text-sm">Your Story Matters</span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl text-white font-bold mb-6 leading-none tracking-tight">
                  Share Your Journey
                </h2>
                <div className="w-16 h-1 bg-[#df2020] mx-auto mb-8"></div>
                <p
                  className="text-white/80 mb-10 text-lg leading-relaxed"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  Has God transformed your life? Your testimony could be the encouragement someone needs today.
                  Share your story and inspire others.
                </p>
                <Link
                  href="/testimonies/submit"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-all border-4 border-white hover:border-gray-200"
                >
                  <span>Submit Your Testimony</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}