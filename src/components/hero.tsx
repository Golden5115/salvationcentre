'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroSlide {
  image: string
  title: string
  subtitle: string
}

const heroSlides: HeroSlide[] = [
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg',
    title: 'Welcome Home',
    subtitle: 'Experience the grace and love of Christ in our community',
  },
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4857-Z3A7pqzNSwXrtZ9KbgHQ3lH4AGs93U.jpg',
    title: 'Come and Worship',
    subtitle: 'Join us for dynamic worship and transformative messages',
  },
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4831-N5FYWGVonGoUhlWqOmlxtODSTDGwMJ.jpg',
    title: 'Celebrating Faith',
    subtitle: 'A vibrant community united in faith and service',
  },
  {
    image: 'https://res.cloudinary.com/dxlyd19av/image/upload/v1769007761/Headphone_Aesthetic_HD_Wallpaper_for_PC_Laptops_usdl4x.jpg',
    title: 'Join the Live Stream',
    subtitle: 'Experience our services online with crystal clear audio and immersive connection',
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  return (
    <section className="relative w-full h-[600px] md:h-screen overflow-hidden bg-black">
      {/* Slides with enhanced animations */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Dark overlay to make text readable */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
        <div key={currentSlide} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-lg text-balance">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-2xl font-light mb-10 drop-shadow-md text-balance max-w-2xl mx-auto">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/about"
              className="px-8 py-3 bg-black text-white font-semibold rounded-sm hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide hover:scale-110 transform"
            >
              Learn More
            </Link>
            
            <Link
              href="/live"
              className="px-8 py-3 bg-black border border-white text-white font-semibold rounded-sm hover:bg-white hover:text-black transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide hover:scale-110 transform"
            >
              Watch Live
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 z-20">
        <button
          onClick={handlePrevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm hover:scale-110 transform"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm hover:scale-110 transform"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators - Updated to show 4 indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}