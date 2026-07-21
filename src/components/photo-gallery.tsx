'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Instagram, Youtube, Facebook } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
  title: string
}

const galleryImages: GalleryImage[] = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg',
    alt: 'Sunday Service - Prayer Time',
    title: 'Sunday Service',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4857-Z3A7pqzNSwXrtZ9KbgHQ3lH4AGs93U.jpg',
    alt: 'Welcome Event - Community Gathering',
    title: 'Welcome Event',
  },
  {
    src: 'https://res.cloudinary.com/dxlyd19av/image/upload/v1765293913/GT_bj2me7.jpg',
    alt: 'General Thanksgiving - Celebration',
    title: 'General Thanksgiving',
  },
  {
    src: 'https://res.cloudinary.com/dxlyd19av/image/upload/v1765293463/service_krixlq.jpg',
    alt: 'Worship in Spirit',
    title: 'Worship Experience',
  },
  {
    src: 'https://res.cloudinary.com/dxlyd19av/image/upload/v1765294111/DSC_8560_iznf8g.jpg',
    alt: 'Community Fellowship',
    title: 'Fellowship Time',
  },
  {
    src: 'https://res.cloudinary.com/dxlyd19av/image/upload/v1765293793/bible_study_ripnuv.jpg',
    alt: 'Bible Study Session',
    title: 'Bible Study',
  },
]

const BACKGROUND_IMAGE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg'

export function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      {/* Main Gallery Section */}
      <section className="py-20 md:py-28 relative bg-black overflow-hidden">
        {/* Background Image — Subtle */}
        <div className="absolute inset-0">
          <Image
            src={BACKGROUND_IMAGE}
            alt="Sunday prayer and worship background"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-black/92" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-2xl">
              Moments from Our Community
            </h2>
            <p className="mt-4 text-xl md:text-2xl text-white/90 drop-shadow-lg font-light">
              Celebrating faith, fellowship, and transformation
            </p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-lg cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-500 h-72 bg-black/30 backdrop-blur-md border border-white/20"
              >
                <Image
                  src={image.src || '/placeholder.svg'}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-serif text-xl md:text-2xl font-bold drop-shadow-2xl">
                      {image.title}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">Click to view larger</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action + Social Media Links */}
          <div className="text-center mt-16">
            <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md mb-10">
              More moments coming soon. Follow us on social media for updates!
            </p>

            {/* Social Media Icons — Monochrome */}
            <div className="flex justify-center items-center gap-10">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/rccgsalvationcentre" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/30 hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/rccg_salvation_centre"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/30 hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@rccgsalvationcentre289"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/30 hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl"
                aria-label="Subscribe to our YouTube Channel"
              >
                <Youtube className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src || '/placeholder.svg'}
              alt={selectedImage.alt}
              width={1400}
              height={900}
              className="w-full h-auto rounded-lg shadow-2xl"
              priority
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:top-6 md:right-6 bg-white hover:bg-gray-200 text-black p-3 rounded-full shadow-2xl transition-all hover:scale-110"
              aria-label="Close"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/95 via-black/70 to-transparent p-8 rounded-b-lg">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-lg">
                {selectedImage.title}
              </h3>
              <p className="text-white/90 text-lg mt-2">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoGallery