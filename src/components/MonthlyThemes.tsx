"use client";

import Image from "next/image";
import { Instagram, Youtube, Facebook } from "lucide-react";

// Tracked image assets
const THEME_IMAGE_1 = "https://res.cloudinary.com/dxlyd19av/image/upload/v1777725810/WhatsApp_Image_2026-04-06_at_12.14.12_k4jqop.jpg";
const THEME_IMAGE_2 = "https://res.cloudinary.com/dxlyd19av/image/upload/v1781651054/IMG-20260616-WA0008_t5xq06.jpg";
const THEME_IMAGE_3 = "https://res.cloudinary.com/dxlyd19av/image/upload/v1781650868/IMG-20260616-WA0009_eaco7q.jpg";

// Array holding your different theme banners
const monthlyThemes = [
  { src: THEME_IMAGE_1, alt: "Monthly Theme Banner 1" },
  { src: THEME_IMAGE_2, alt: "Monthly Theme Banner 2" },
  { src: THEME_IMAGE_3, alt: "Monthly Theme Banner 3" },
];

export function MonthlyThemes() {
  return (
    <>
      <style jsx global>{`
        @keyframes rollercoaster {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-rollercoaster {
          display: flex;
          width: max-content;
          animation: rollercoaster 35s linear infinite;
        }
        .animate-rollercoaster:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Themes Section */}
      <section className="py-20 md:py-24 relative bg-black overflow-hidden">
        
        {/* Content Header Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
              Our Monthly Themes
            </h2>
            <p className="mt-3 text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Anchoring our hearts and community in prophetic directions for each month.
            </p>
          </div>
        </div>

        {/* Rollercoaster Infinite Rolling Container */}
        <div className="relative w-full overflow-hidden my-4 py-2 border-y border-white/5 bg-neutral-950/50">
          {/* Gradient masking covers for edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Double-mapped slide tracks to anchor gapless infinite looping */}
          <div className="animate-rollercoaster gap-6 px-3">
            {[...monthlyThemes, ...monthlyThemes].map((theme, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-[320px] sm:w-[460px] md:w-[540px] aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 group"
              >
                <Image
                  src={theme.src}
                  alt={theme.alt}
                  fill
                  priority={idx < 3}
                  sizes="(max-width: 768px) 320px, 540px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action & Social Connections */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mt-14">
          <p className="text-white/80 text-base md:text-lg font-medium mb-8">
            Stay aligned with all service highlights. Connect with our updates!
          </p>

          {/* Social Icons Layout */}
          <div className="flex justify-center items-center gap-6 md:gap-8">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/rccgsalvationcentre"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-6 h-6 text-white group-hover:text-black transition-transform group-hover:scale-105" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/rccg_salvation_centre"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-6 h-6 text-white group-hover:text-black transition-transform group-hover:scale-105" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@rccgsalvationcentre289"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
              aria-label="Subscribe to our YouTube Channel"
            >
              <Youtube className="w-6 h-6 text-white group-hover:text-black transition-transform group-hover:scale-105" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default MonthlyThemes;