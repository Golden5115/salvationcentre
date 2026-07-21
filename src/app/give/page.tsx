// src/app/give/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import { Globe, ArrowDown, HeartHandshake } from "lucide-react"
import AccountDetailsSection from "@/components/Give/account-details-section"
//import BibleVerseSection from "@/components/Give/bible-verse-section"

export const metadata: Metadata = {
  title: "Give & Support | Ministry",
  description: "Support the ministry through secure bank transfers. Your generosity transforms lives globally.",
}

export default function GivePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background Image */}
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

          {/* Subtle cross + diamond pattern */}
          <div className="absolute inset-0 z-20 opacity-[0.08]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="give-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
                  <path d="M75 15 L75 135 M15 75 L135 75" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeOpacity="0.5" />
                  <path d="M75 50 L100 75 L75 100 L50 75 Z" fill="#FFFFFF" fillOpacity="0.15" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#give-pattern)" />
            </svg>
          </div>

          {/* Faint blue + red glow — ties to RCCG's own logo colors without overwhelming the palette */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 z-20 pointer-events-none"
            style={{ background: "#1d4ed8" }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 z-20 pointer-events-none"
            style={{ background: "#df2020" }}
          />

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 relative z-30">
            <div className="text-center">
              {/* Eyebrow badge — same pattern as the Testimonies hero badge */}
              <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-3.5 h-3.5" style={{ color: "#df2020" }} />
                  <span className="text-white font-bold uppercase tracking-widest text-xs">
                    Giving &amp; Generosity
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-none tracking-tight">
                Your Gift Goes Further When Given Directly
              </h1>

              {/* Two-tone accent — blue and red, side by side */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <div className="w-10 h-1" style={{ background: "#1d4ed8" }} />
                <div className="w-10 h-1" style={{ background: "#df2020" }} />
              </div>

              <p
                className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
                style={{ fontFamily: "var(--font-lora)" }}
              >
                I have shown you in every way, by laboring like this, that you must support the weak. And remember the words of the Lord Jesus, that He said, &lsquo;It is more blessed to give than to receive.&rsquo;
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-200 mb-12">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: "#1d4ed8" }} />
                  <span className="text-sm font-medium">Local &amp; International Transfers Accepted</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/30" />
                <div className="flex items-center gap-3">
                  <ArrowDown className="w-5 h-5" style={{ color: "#df2020" }} />
                  <span className="text-sm font-medium">Account details below</span>
                </div>
              </div>

              {/* FIXED: Re-added the opening '<a' tag here */}
              <a
                href="#account-details"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                View Bank Details
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>
            </div>
          </div>
        </section>

        <section id="account-details" className="py-24 md:py-32 px-6 bg-linear-to-b from-background to-muted/50">
          <div className="max-w-7xl mx-auto">
            <AccountDetailsSection />
          </div>
        </section>
      </main>
    </div>
  )
}