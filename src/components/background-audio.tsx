'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const pathname = usePathname()
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted
      audioRef.current.muted = nextMuted
      setIsMuted(nextMuted)

      if (!nextMuted && audioRef.current.paused) {
        audioRef.current.play().catch(console.error)
      }
    }
  }

  useEffect(() => {
    // Only play on home page
    if (pathname !== '/') {
      if (audioRef.current) audioRef.current.pause()
      return
    }

    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        audioRef.current.volume = 0.5
        audioRef.current.play().catch(() => { })
      }
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('scroll', handleFirstInteraction, { passive: true })
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true })

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [pathname, isMuted])

  if (pathname !== '/') return null

  return (
    <>
      {/* 👇👇 BACKGROUND AUDIO SOURCE 👇👇 */}
      <audio
        ref={audioRef}
        src={process.env.NEXT_PUBLIC_WORSHIP_SONG_URL || 'https://res.cloudinary.com/dxlyd19av/video/upload/v1782606100/Don_Moen_-_God_is_the_strength_of_my_heart__mp3.pm_xafz2f.mp3'}
        autoPlay
        loop
        muted={isMuted}
      />

      {/* ── Audio Control Button ── */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={toggleMute}
        className="fixed bottom-10 right-10 z-[100] p-3.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all shadow-lg hover:scale-105 active:scale-95 group"
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </motion.button>
    </>
  )
}
