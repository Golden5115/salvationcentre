/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export default function BibleVerseSection() {
  const fullVerse = "It is more blessed to give than to receive."
  const [displayedText, setDisplayedText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullVerse.length) {
        setDisplayedText((prev) => prev + fullVerse[index])
        index++
      } else {
        setIsTypingComplete(true)
        clearInterval(timer)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden py-32 md:py-40 px-6 bg-white">
      {/* Monochromatic Dots Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #C80036 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center',
            maskImage: 'radial-gradient(circle at center, black, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 70%)'
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/30" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
        {/* Sparkles Icon with floating animation */}
        <Sparkles className="w-16 h-16 md:w-20 md:h-20 mx-auto text-primary animate-pulse-soft drop-shadow-lg" />

        {/* The Typing Verse */}
        <blockquote className="relative">
          <div className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-wide text-dark">
            <span className="inline-block">
              <span className="opacity-0">"</span>
              {displayedText}
              {/* Cursor blink effect */}
              {!isTypingComplete && (
                <span className="inline-block w-1 h-12 md:h-16 bg-primary align-middle animate-pulse ml-1" />
              )}
              {isTypingComplete && (
                <>
                  <span className="text-primary"> give</span> than to receive."
                </>
              )}
            </span>
          </div>

          {isTypingComplete && (
            <div className="mt-6 h-1 w-32 mx-auto bg-linear-to-r from-transparent via-primary to-transparent rounded-full opacity-40 animate-fade-in" />
          )}
        </blockquote>

        <p
          className={`text-2xl md:text-3xl font-medium text-muted transition-all duration-1000 ${
            isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          — Acts 20:35
        </p>

        {/* Final Message */}
        <div
          className={`max-w-3xl mx-auto pt-10 border-t border-primary/20 transition-all duration-1500 delay-500 ${
            isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-lg md:text-xl leading-relaxed text-dark/80 font-medium">
            Thank you for partnering with us in this divine mission.<br />
            <span className="text-primary/90">
              Your generosity is a powerful declaration of faith
            </span>{" "}
            and a legacy that transforms lives for eternity.
          </p>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </section>
  )
}