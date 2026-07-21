// src/components/Footer.tsx
import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white/90 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* About */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-extrabold tracking-tight text-white">RCCG Salvation Centre</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              The Redeemed Christian Church of God - Salvation Centre. A place of worship, transformation, and divine encounter in the heart of Ikeja.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.instagram.com/rccg_salvation_centre"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-xl"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/salvationcentre"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-xl"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.youtube.com/@rccgsalvationcentre289"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-xl"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-serif font-bold text-xl text-white">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-white/80 hover:text-accent transition">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/80 hover:text-accent transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/live" className="text-white/80 hover:text-accent transition">
                  Live Streaming
                </Link>
              </li>
              <li>
                <Link href="/give" className="text-white/80 hover:text-accent transition">
                  Give
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-serif font-bold text-xl text-white">Contact Us</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-4 items-start">
                <MapPin size={20} className="shrink-0 mt-0.5 text-accent" />
                <span className="text-white/90 leading-relaxed">
                  10, Oba Akinjobi Way,<br />
                  GRA, Ikeja, Lagos State,<br />
                  Nigeria
                </span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone size={20} className="shrink-0 text-accent" />
                <a href="tel:+2348111514544" className="text-white/90 hover:text-accent transition">
                  08111514544
                </a>
              </li>
              <li className="flex gap-4 items-center">
                <Mail size={20} className="shrink-0 text-accent" />
                <a
                  href="mailto:Rccgsalvationcentre01@gmail.com"
                  className="text-white/90 hover:text-accent transition break-all"
                >
                  Rccgsalvationcentre01@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-6">
            <h4 className="font-serif font-bold text-xl text-white">Programs</h4>
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-bold text-white">Tuesdays: Bible Study</p>
                <p className="text-white/80 mt-1">6:30 PM – 8:00 PM</p>
              </div>
              <div>
                <p className="font-bold text-white">Wednesdays: Online Vigil</p>
                <p className="text-white/80 mt-1">11:00 PM – 1:00 AM</p>
              </div>
              <div>
                <p className="font-bold text-white">Thursday: Faith Clinic</p>
                <p className="text-white/80 mt-1">6:30 PM – 8:00 PM</p>
              </div>
              <div>
                <p className="font-bold text-white">First of Every Month: Beginning with Jesus</p>
                <p className="text-white/80 mt-1">6:00 AM – 7:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-10 mt-8 flex flex-col items-center">
          <div className="text-center">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} RCCG Salvation Centre. All rights reserved.
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <Link href="/privacy-policy" className="text-xs text-white/50 hover:text-accent transition">Privacy Policy</Link>
              <span className="text-white/20 text-xs">•</span>
              <Link href="/cookies-policy" className="text-xs text-white/50 hover:text-accent transition">Cookies Policy</Link>
            </div>
            <p className="text-xs text-white/40 mt-4">
              Loving God • Serving People • Transforming Lives
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}