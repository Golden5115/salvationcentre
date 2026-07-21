/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { Play, Share2, Calendar, User, Youtube, Pause } from 'lucide-react';
import { SermonCardProps } from '@/lib/types/sermon';

export function SermonCard({ sermon }: SermonCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleShare = () => {
    const shareUrl = `https://www.youtube.com/watch?v=${sermon.youtubeId}`;
    
    if (navigator.share) {
      navigator.share({
        title: sermon.title,
        text: sermon.description,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Video link copied to clipboard!'))
        .catch(() => alert('Failed to copy link. Please copy manually.'));
    }
  };

  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${sermon.youtubeId}`, '_blank', 'noopener,noreferrer');
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!videoLoaded) {
      setVideoLoaded(true);
    }
  };

  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
    const currentQuality = currentSrc.split('/').pop() || 'maxresdefault.jpg';
    
    const qualityMap: Record<string, string> = {
      'maxresdefault.jpg': 'maxresdefault',
      'sddefault.jpg': 'sddefault',
      'hqdefault.jpg': 'hqdefault',
      'mqdefault.jpg': 'mqdefault',
      'default.jpg': 'default'
    };
    
    const currentQualityKey = qualityMap[currentQuality] || 'maxresdefault';
    const currentIndex = qualities.indexOf(currentQualityKey);
    
    if (currentIndex < qualities.length - 1) {
      const nextQuality = qualities[currentIndex + 1];
      img.src = `https://img.youtube.com/vi/${sermon.youtubeId}/${nextQuality}.jpg`;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col border border-gray-200">
      {/* Video container */}
      <div className="bg-black aspect-video relative overflow-hidden rounded-t-2xl">
        {isPlaying && videoLoaded && (
          <div className="absolute inset-0 z-20">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${sermon.youtubeId}?autoplay=1&rel=0`}
              title={sermon.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              onLoad={() => setVideoLoaded(true)}
            />
          </div>
        )}
        
        {(!isPlaying || !videoLoaded) && (
          <>
            <div className="relative w-full h-full">
              <img
                src={`https://img.youtube.com/vi/${sermon.youtubeId}/maxresdefault.jpg`}
                alt={sermon.title}
                className="w-full h-full object-cover"
                onError={handleThumbnailError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300 group-hover:scale-110">
                <Play size={32} className="text-white ml-1" />
              </div>
            </div>
          </>
        )}

        {sermon.duration && (
          <span className="absolute top-4 right-4 text-xs bg-black/90 text-white px-3 py-1 rounded-full font-medium z-30">
            {sermon.duration}
          </span>
        )}

        {isPlaying && videoLoaded && (
          <button
            onClick={togglePlay}
            className="absolute top-4 left-4 z-30 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        )}
      </div>
      
      <div className="p-8 space-y-4 flex-1 flex flex-col">
        <div>
          <h3 className="font-serif text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
            {sermon.title}
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-black">
              <Calendar size={16} />
              <span className="text-sm">{sermon.date}</span>
            </div>
            <span className="text-sm bg-gray-200 text-black px-3 py-1 rounded-full font-medium">
              {sermon.service}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-gray-700" />
            <p className="text-black font-semibold text-sm">{sermon.pastor}</p>
          </div>
        </div>

        {sermon.description && (
          <p className="text-black leading-relaxed flex-1">{sermon.description}</p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button 
            className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105 transform"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause Video" : "Play Video"}
          </button>
          <div className="flex gap-3">
            <button 
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105 transform"
              onClick={handleWatchOnYouTube}
            >
              <Youtube size={18} />
              YouTube
            </button>
            <button 
              className="px-4 py-3 border border-gray-300 text-black hover:bg-gray-100 rounded-lg transition-all hover:scale-105 transform flex items-center gap-2"
              title="Share Video"
              onClick={handleShare}
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}