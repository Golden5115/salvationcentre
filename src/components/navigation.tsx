'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, X, Menu, Phone, Facebook, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isDarkNav = scrolled || pathname !== '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const exploreLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Events', href: '/events' },
    { label: 'Program Registration', href: '/program-registration' },
    { label: 'Testimonies', href: '/testimonies' },
    { label: 'Connect', href: '/connect' },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Phone, href: 'tel:+2348111514544', label: 'Phone' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'X' },
  ]

  const navLinkClass = "relative px-2 py-2 text-[12px] font-medium text-white uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap hover:text-white group"

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
        {/* ── Social Top Bar — hides on scroll ── */}
        <div
          className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isDarkNav ? 'max-h-0 opacity-0 border-transparent' : 'max-h-12 opacity-100 border-b border-white/10 bg-black/20 backdrop-blur-sm'
            }`}
        >
          <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-20 flex justify-end items-center h-10 gap-6">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/60 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Icon size={14} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Main Nav ── */}
        <nav
          className={`w-full transition-all duration-500 ease-in-out border-b ${isDarkNav
            ? 'bg-[#0a0a0c]/85 backdrop-blur-2xl border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2'
            : 'bg-transparent border-transparent py-4'
            }`}
        >
          <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-20">
            <div className="flex items-center justify-between">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-4 flex-shrink-0 group">
                <div className={`relative transition-all duration-500 ease-in-out ${isDarkNav ? 'w-12 h-12' : 'w-16 h-16'}`}>
                  <Image
                    src="/IMG-20260616-WA0020-removebg-preview.png"
                    alt="RCCG Salvation Centre"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="hidden sm:flex flex-col justify-center">
                  <div
                    className={`font-semibold tracking-[0.05em] text-white transition-all duration-500 drop-shadow-md ${isDarkNav ? 'text-[17px]' : 'text-[22px]'}`}
                    style={{ fontFamily: 'var(--font-lora), serif' }}
                  >
                    RCCG <span className="text-[#DDB771]">SALVATION CENTRE</span>
                  </div>
                  <div className={`tracking-[0.25em] text-white font-medium uppercase transition-all duration-500 drop-shadow ${isDarkNav ? 'text-[8px] mt-0' : 'text-[10px] mt-0.5'}`}>
                    A Place of Status Change
                  </div>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-8">
                <Link href="/sermons" className={navLinkClass}>
                  Watch Live
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#E63946] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* Explore Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setExploreOpen(!exploreOpen)}
                    className={`flex items-center gap-2 ${navLinkClass}`}
                  >
                    Explore
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${exploreOpen ? 'rotate-180 text-[#E63946]' : ''}`}
                    />
                    <span className={`absolute left-0 -bottom-1 h-[1px] bg-[#E63946] transition-all duration-300 ${exploreOpen ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>

                  {/* Dropdown Panel */}
                  <div
                    className={`absolute top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 w-64 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 p-2 shadow-2xl rounded-xl transition-all duration-300 ease-out origin-top ${exploreOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                      }`}
                  >
                    {exploreLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setExploreOpen(false)}
                        className="flex items-center justify-between px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group/item"
                      >
                        {item.label}
                        <ChevronRight size={12} className="opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-[#E63946]" />
                      </Link>
                    ))}
                  </div>
                </div>

                <Link href="/events" className={navLinkClass}>
                  Events
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#E63946] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link href="/testimonies" className={navLinkClass}>
                  Testimonies
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#E63946] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link href="/connect" className={navLinkClass}>
                  Connect
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#E63946] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* GIVE — Premium Button */}
                <Link
                  href="/give"
                  className="ml-4 px-8 py-3 bg-[#DDB771] text-[11px] font-bold text-white uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:bg-[#ff4d5a] hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Give
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden text-white hover:text-[#E63946] transition-colors p-2"
                aria-label="Open menu"
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile Full-Screen Menu ── */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0a0a0c]/98 backdrop-blur-2xl transition-all duration-500 ease-in-out lg:hidden flex flex-col ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
            <Image
              src="/IMG-20260616-WA0020-removebg-preview.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="font-serif text-white tracking-widest text-lg">RCCG <span className="text-[#E63946]">SC</span></span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-8 py-10 gap-6">
          <Link
            href="/sermons"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all flex items-center gap-4 group"
          >
            <span className="w-8 h-[1px] bg-white/20 group-hover:bg-[#E63946] transition-colors"></span>
            Watch Live
          </Link>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className="text-lg font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-[1px] transition-colors ${exploreOpen ? 'bg-[#E63946]' : 'bg-white/20 group-hover:bg-[#E63946]'}`}></span>
                Explore
              </div>
              <ChevronRight
                size={20}
                className={`transition-transform duration-300 text-white/40 ${exploreOpen ? 'rotate-90 text-[#E63946]' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out pl-12 flex flex-col gap-4 ${exploreOpen ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
            >
              {exploreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setIsOpen(false); setExploreOpen(false) }}
                  className="text-sm font-light uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/events" onClick={() => setIsOpen(false)} className="text-lg font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all flex items-center gap-4 group">
            <span className="w-8 h-[1px] bg-white/20 group-hover:bg-[#E63946] transition-colors"></span> Events
          </Link>
          <Link href="/testimonies" onClick={() => setIsOpen(false)} className="text-lg font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all flex items-center gap-4 group">
            <span className="w-8 h-[1px] bg-white/20 group-hover:bg-[#E63946] transition-colors"></span> Testimonies
          </Link>
          <Link href="/connect" onClick={() => setIsOpen(false)} className="text-lg font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all flex items-center gap-4 group">
            <span className="w-8 h-[1px] bg-white/20 group-hover:bg-[#E63946] transition-colors"></span> Connect
          </Link>
        </div>

        <div className="px-8 pb-10 flex flex-col gap-8">
          <Link
            href="/give"
            onClick={() => setIsOpen(false)}
            className="w-full py-4 bg-[#E63946] text-white text-sm font-bold uppercase tracking-[0.2em] rounded-xl text-center transition-all duration-300 hover:bg-[#ff4d5a] shadow-[0_0_20px_rgba(230,57,70,0.2)]"
          >
            Give Online
          </Link>

          <div className="flex items-center justify-center gap-8 border-t border-white/10 pt-8">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-white/40 hover:text-[#E63946] transition-colors duration-300">
                <Icon size={20} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}