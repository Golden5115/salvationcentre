"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Clock, Archive, Radio } from "lucide-react";
import { SermonCard } from "./sermons/SermonCard"; 
import { Sermon } from "@/lib/types/sermon";

export function LiveStreaming() {
  const [isLoading, setIsLoading] = useState(true);
  const [latestSermon, setLatestSermon] = useState<Sermon | null>(null);

  const isLive = false;

  useEffect(() => {
    let isMounted = true;

    const fetchLatestSermon = async () => {
      // Safety Timeout: Force stop loading after 3 seconds if the network hangs
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn("Sermon fetch timed out. Falling back to default video.");
          setIsLoading(false);
        }
      }, 3000);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) {
          throw new Error("API Base URL is not defined");
        }

        const response = await fetch(`${baseUrl}/api/sermons/latest`);

        if (!response.ok) {
          throw new Error(`Failed to fetch latest sermon: ${response.statusText}`);
        }

        const sermon = await response.json();

        if (isMounted) {
          if (sermon && typeof sermon === "object" && sermon.id) {
            setLatestSermon(sermon);
          } else {
            setLatestSermon(null);
          }
        }
      } catch (err) {
        console.error("Error fetching latest sermon, dropping back to UI video fallback:", err);
        if (isMounted) {
          setLatestSermon(null);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLatestSermon();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return dateString;
    }
  };

  const getSermonCardData = () => {
    if (!latestSermon) return null;

    return {
      id: latestSermon.id,
      title: latestSermon.title || "Latest Message",
      pastor: latestSermon.pastor || "Speaker",
      service: latestSermon.service || "Service",
      date: formatDate(latestSermon.date),
      duration: latestSermon.duration || "",
      description: latestSermon.description || "Watch our latest inspiring message",
      youtubeId: latestSermon.youtubeId,
    };
  };

  if (isLoading) {
    return (
      <section className="relative py-20 md:py-28 overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-gray-200 animate-pulse rounded-xl"></div>
              <div className="mt-4 space-y-3">
                <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 animate-pulse rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <div className="h-8 bg-gray-300 animate-pulse rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-300 animate-pulse rounded w-5/6 mt-2"></div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const sermonCardData = getSermonCardData();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, black 1px, transparent 1px),
              linear-gradient(to bottom, black 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Card / Video Display Grid Side */}
          <div className="relative">
            <div className="absolute -top-4 left-4 z-10 bg-black text-white px-4 py-2 rounded-sm shadow-lg flex items-center gap-2 border border-gray-700">
              <Play className="w-4 h-4" />
              <span className="font-semibold text-sm uppercase tracking-wide">
                {sermonCardData ? "Latest Message" : "Featured Video"}
              </span>
            </div>

            {isLive && (
              <div className="absolute -top-4 right-4 z-10 bg-black text-white px-4 py-2 rounded-sm shadow-lg flex items-center gap-2 border border-gray-700 animate-pulse">
                <Radio className="w-4 h-4" />
                <span className="font-semibold text-sm uppercase tracking-wide">Live Now</span>
              </div>
            )}

            {sermonCardData ? (
              <SermonCard sermon={sermonCardData} />
            ) : (
              /* Hardcoded UI Fallback Video rendered instantly if backend is unavailable */
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col min-h-[450px]">
                <div className="bg-black aspect-video relative rounded-t-2xl overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/ssxDon3Xl3A"
                    title="Featured Sermon Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-center">
                  <h3 className="font-serif text-2xl font-bold text-black mb-1 text-center">
                    Featured Worship Service
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    Our servers are currently updating. Enjoy this message from our video library while we reconnect!
                  </p>
                  <div className="pt-6 border-t border-gray-200 flex justify-center">
                    <Link
                      href="/live"
                      className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium tracking-wide transition-all uppercase text-sm"
                    >
                      <Clock className="w-4 h-4" />
                      View Service Schedule
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Panels */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                Watch Live Services
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience dynamic worship and inspiring messages with our global community
              </p>

              {latestSermon && (
                <div className="mt-6 p-4 bg-gray-50 rounded-sm border border-gray-200">
                  <h3 className="font-semibold text-black text-xl mb-2">Latest Message Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-black">
                    <div>
                      <span className="text-gray-600">Service:</span>
                      <p className="font-medium">{latestSermon.service}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Speaker:</span>
                      <p className="font-medium">{latestSermon.pastor}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Originally Recorded:</span>
                      <p className="font-medium">{formatDate(latestSermon.date)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 hover:border-gray-400 transition-all">
                <div className="shrink-0 w-14 h-14 rounded-sm bg-black flex items-center justify-center shadow-md">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1 text-xl">Live Every Sunday</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">9:00 AM - 12:00 PM (EST)</p>
                </div>
              </div>

              <div className="flex gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 hover:border-gray-400 transition-all">
                <div className="shrink-0 w-14 h-14 rounded-sm bg-black flex items-center justify-center shadow-md">
                  <Archive className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-black mb-1 text-xl">Access Archives</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Watch past messages anytime, 24/7</p>
                </div>
              </div>

              <div className="flex gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 hover:border-gray-400 transition-all">
                <div className="shrink-0 w-14 h-14 rounded-sm bg-black flex items-center justify-center shadow-md">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-black mb-1 text-xl">Multiple Services</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Sunday & Midweek prayer sessions available</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/sermons"
                className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-sm font-semibold text-lg uppercase tracking-wide transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Archive className="w-5 h-5" />
                View All Sermons
              </Link>

              <Link
                href="/live"
                className="inline-flex items-center gap-2 bg-transparent hover:bg-gray-100 text-black border-2 border-gray-900 px-8 py-4 rounded-sm font-semibold text-lg uppercase tracking-wide transition-all duration-300"
              >
                <Radio className="w-5 h-5" />
                Live Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}