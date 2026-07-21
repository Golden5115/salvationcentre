/* eslint-disable react/no-unescaped-entities */
// components/ui/CtaSection.tsx
import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background with whitish-brown tone + subtle geometric pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#fdfaf5', // warm off-white / light beige-brownish
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Optional very soft overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/5" />

      <div className="relative container mx-auto px-6 text-center z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-black">
          Join Our Faith Family Today
        </h2>
        <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-black-700">
          Whether you're new to faith or looking for a spiritual home, there's a place for you here.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/visit"
            className="bg-black text-white px-12 py-5 text-xl font-bold 
                       hover:bg-gray-800 transition-all transform hover:scale-105 
                       rounded-md shadow-lg"
          >
            Plan Your Visit
          </Link>

          <Link
            href="/give"
            className="border-2 border-black text-gray-900 px-12 py-5 text-xl font-bold 
                       hover:bg-gray-900 hover:text-white transition-all 
                       rounded-md shadow-lg"
          >
            Support the Ministry
          </Link>
        </div>
      </div>
    </section>
  )
}