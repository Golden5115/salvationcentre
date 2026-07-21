'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, PlayCircle, ChevronDown } from 'lucide-react'

const slides = [
  {
    headline: <>Find <span className="text-[#DDB771]">Hope</span> Again</>,
    sub: 'A place where faith, purpose, and community come together.',
  },
  {
    headline: <>Experience God's Presence</>,
    sub: 'Join a growing family rooted in worship and transformation.',
  },
  {
    headline: <>You Were Made For This Place</>,
    sub: 'Discover authentic relationships and a deeper walk with Christ.',
  },
  {
    headline: <>Worship.<br />Grow. Serve.</>,
    sub: 'Building lives, strengthening families, and impacting communities.',
  },
]

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1 as const,
      duration: 0.4,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -150 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
}

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0, originX: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { scaleX: 0, opacity: 0, transition: { duration: 0.4 } },
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const slide = slides[current]

  return (
    <section
      className="relative h-[100vh] min-h-[600px] md:min-h-[700px] overflow-hidden bg-[#070b14] flex items-center"
      aria-label="Hero section"
    >

      {/* ── Background Image ── */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/hero_bg3.jpeg"
            alt="Worship Service"
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>
        {/* Gradients to darken left side and bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-transparent to-transparent" />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 mt-24 md:mt-32">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-[3.5rem] md:text-7xl lg:text-[6rem] font-medium text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl"
                style={{ fontFamily: 'var(--font-lora), serif' }}
              >
                {slide.headline}
              </motion.h1>

              {/* Small separator */}
              <motion.div
                variants={lineVariants}
                className="w-16 h-[2px] bg-[#DDB771] mb-8"
              />

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-[22px] text-white/90 font-light leading-relaxed max-w-[460px] mb-12 drop-shadow-md"
              >
                {slide.sub}
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-5 mb-14"
              >
                <Link
                  href="/visit"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#DDB771] text-[#111] text-[15px] font-semibold rounded-md transition-all duration-300 hover:bg-[#ebd097] hover:shadow-[0_0_20px_rgba(221,183,113,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Calendar className="w-5 h-5" strokeWidth={1.5} />
                  Plan Your Visit
                </Link>

                <Link
                  href="/live"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[#DDB771] text-white text-[15px] font-semibold rounded-md transition-all duration-300 hover:bg-[#DDB771]/10 hover:shadow-[0_0_20px_rgba(221,183,113,0.1)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PlayCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
                  Watch Live
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* ── Slide indicators (Right Side) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-500 ${i === current ? 'w-3 h-3 bg-[#DDB771] shadow-[0_0_10px_rgba(221,183,113,0.5)]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
          />
        ))}
      </motion.div>

      {/* ── Scroll Down Arrow ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown className="w-8 h-8 text-[#DDB771] animate-bounce" strokeWidth={1.5} />
      </motion.div>

      {/* ── Curved Bottom Divider ── */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden z-20 leading-none">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-[60px] md:h-[100px] block"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q720,180 1440,0 L1440,100 L0,100 Z" fill="#ffffff" />
        </svg>
      </div>

    </section>
  )
}