'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check local storage after component mounts to avoid hydration errors
    const hasConsented = localStorage.getItem('cookie-consent')
    if (!hasConsented) {
      // Delay showing it slightly for better UX
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setShowConsent(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowConsent(false)
  }

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
            <button 
              onClick={handleDecline} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors sm:hidden"
            >
              <X size={20} />
            </button>
            
            <div className="flex-1 pr-6 sm:pr-0">
              <h3 className="text-[#0a0a0c] font-semibold text-lg mb-2" style={{ fontFamily: 'var(--font-lora), serif' }}>
                We value your privacy
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                <Link href="/cookies-policy" className="text-[#DDB771] hover:underline font-medium">
                  Cookie Policy
                </Link>.
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#0a0a0c] text-white font-medium text-sm hover:bg-[#DDB771] transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
