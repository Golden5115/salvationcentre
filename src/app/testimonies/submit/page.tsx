import type { Metadata } from 'next'
import Image from 'next/image'
import { SubmitTestimonyForm } from '@/components/testimonies/SubmitTestimonyForm'

export const metadata: Metadata = {
  title: 'Submit Testimony - RCCG Salvation Centre',
  description: 'Share your testimony of faith, healing, and transformation with our community.',
}

export default function SubmitTestimonyPage() {
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

        <div className="max-w-7xl mx-auto px-6 relative z-30 text-center">
          <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold uppercase tracking-widest text-xs">Your Story Matters</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Share Your<br />
            <span className="italic font-light">Testimony</span>
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
            Your story can inspire others. Share how God has worked in your life.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <div className="min-h-screen bg-white py-24 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="mb-12">
            <div className="w-24 h-1 bg-black mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Tell Us<br />
              <span className="italic">Your Story</span>
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Share your journey of faith, healing, and transformation
            </p>
          </div>

          <div className="border-4 border-black bg-white p-8 md:p-12 relative">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-black"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black"></div>

            <div className="relative z-10">
              <SubmitTestimonyForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}