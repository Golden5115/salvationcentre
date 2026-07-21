"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const cards = [
  {
    eyebrow: "WHO WE ARE",
    title: "About us",
    cta: "LEARN MORE",
    href: "/about",
    image:
      "https://res.cloudinary.com/dxlyd19av/image/upload/v1777725810/WhatsApp_Image_2026-04-07_at_08.11.44_skcxsb.jpg",
  },
  {
    eyebrow: "JOIN OUR COMMUNITY",
    title: "Connect with us",
    cta: "CONNECT",
    href: "/connect",
    image:
      "https://res.cloudinary.com/dxlyd19av/image/upload/v1777725810/WhatsApp_Image_2026-04-07_at_08.11.34_dvnwzr.jpg",
  },
  {
    eyebrow: "ENDLESS CELEBRATION",
    title: "Celebrations",
    cta: "LEARN MORE",
    href: "/about",
    image:
      "https://res.cloudinary.com/dxlyd19av/image/upload/v1777725810/WhatsApp_Image_2026-04-07_at_08.11.49_hdxxd3.jpg",
  },
];

export function WelcomeSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsLargeScreen(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isLargeScreen) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isLargeScreen]);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header Section */}
        <div className="mb-10 md:mb-12">
          <h1
            className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight leading-none mb-4 text-accent"
          >
            Welcome Home!
          </h1>

          <p className="text-gray-600 text-sm md:text-base max-w-xl leading-relaxed">
            Dive into our teachings, events and community.<br />
            Your journey of faith begins here.
          </p>
        </div>

        {/* Desktop Layout: 3 Side-by-side Square Cards with spacing */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Link key={i} href={card.href} className="group relative block overflow-hidden aspect-square rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
              {/* Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
              />

              {/* Dark Layout Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Your Content Headings - Top Aligned */}
              <div className="absolute top-0 left-0 right-0 p-6 pt-8">
                <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1">
                  {card.eyebrow}
                </p>
                <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                  {card.title}
                </h2>
              </div>

              {/* Your Content CTA - Bottom Aligned */}
              <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 flex items-center gap-1.5 text-white">
                <span className="text-[10px] font-bold tracking-wider uppercase border-b border-transparent group-hover:border-white transition-all">
                  {card.cta}
                </span>
                <span className="text-xs transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile / Tablet Layout: Single Card Carousel */}
        <div className="lg:hidden relative">
          <Link
            href={cards[currentSlide].href}
            className="group relative block overflow-hidden aspect-square rounded-2xl mx-auto max-w-md shadow-xl"
          >
            <Image
              src={cards[currentSlide].image}
              alt={cards[currentSlide].title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

            <div className="absolute top-0 left-0 right-0 p-6 pt-8">
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1">
                {cards[currentSlide].eyebrow}
              </p>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                {cards[currentSlide].title}
              </h2>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 flex items-center gap-1.5 text-white">
              <span className="text-[10px] font-bold tracking-wider uppercase">
                {cards[currentSlide].cta}
              </span>
              <span className="text-xs">→</span>
            </div>
          </Link>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-black w-6" : "bg-gray-300 w-1.5"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}