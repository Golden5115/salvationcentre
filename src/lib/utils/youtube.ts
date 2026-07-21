/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/utils/youtube.ts

export function extractYouTubeId(url: string): string {
  if (!url) return "";
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (!hostname.includes('youtube.com') && !hostname.includes('youtu.be')) {
      return "";
    }
    
    const pathname = urlObj.pathname; 
    const searchParams = urlObj.searchParams;
    
    if (pathname.toLowerCase() === '/watch' && searchParams.has('v')) {
      const id = searchParams.get('v') || '';
      return cleanYouTubeId(id);
    }
    
    if (hostname.includes('youtu.be')) {
      const id = pathname.substring(1);
      return cleanYouTubeId(id);
    }
    
    if (pathname.toLowerCase().startsWith('/embed/')) {
      const id = pathname.substring(7); 
      return cleanYouTubeId(id);
    }
    
    if (pathname.toLowerCase().startsWith('/live/')) {
      const id = pathname.substring(6); 
      return cleanYouTubeId(id);
    }
    
    if (pathname.toLowerCase().startsWith('/v/')) {
      const id = pathname.substring(3); 
      return cleanYouTubeId(id);
    }
    
    if (pathname.toLowerCase().startsWith('/shorts/')) {
      const id = pathname.substring(8); 
      return cleanYouTubeId(id);
    }
    
    return "";
  } catch (error) {
    // If URL parsing fails
    return extractYouTubeIdWithRegex(url);
  }
}

function cleanYouTubeId(id: string): string {
  if (!id) return "";
  
  const cleanId = id.split('&')[0].split('?')[0].split('#')[0];
  
  return cleanId.trim();
}


function extractYouTubeIdWithRegex(url: string): string {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i,
    /youtu\.be\/([a-zA-Z0-9_-]+)(?:\?|&|$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return cleanYouTubeId(match[1]);
    }
  }
  
  return "";
}

export function isValidYouTubeId(id: string): boolean {
  if (!id) return false;
  
  
  const length = id.length;
  return length >= 8 && length <= 20;
}


export function getYouTubeThumbnail(
  youtubeId: string, 
  quality: 'default' | 'medium' | 'high' | 'maxres' | 'sddefault' | 'hqdefault' = 'maxres'
): string {
  if (!youtubeId) return "";
  
  const qualities: Record<string, string> = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg',
    sddefault: 'sddefault.jpg',
    hqdefault: 'hqdefault.jpg'
  };
  
  const qualityKey = qualities[quality];
  // YouTube thumbnail URLs are case-sensitive!
  return `https://img.youtube.com/vi/${youtubeId}/${qualityKey}`;
}


export function getAllYouTubeThumbnails(youtubeId: string) {
  return {
    default: getYouTubeThumbnail(youtubeId, 'default'),
    medium: getYouTubeThumbnail(youtubeId, 'medium'),
    high: getYouTubeThumbnail(youtubeId, 'high'),
    hqdefault: getYouTubeThumbnail(youtubeId, 'hqdefault'),
    maxres: getYouTubeThumbnail(youtubeId, 'maxres'),
    sddefault: getYouTubeThumbnail(youtubeId, 'sddefault')
  };
}


export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  const youtubeDomains = [
    'youtube.com',
    'youtu.be',
    'm.youtube.com',
    'www.youtube.com'
  ];
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return youtubeDomains.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}


export function normalizeYouTubeUrl(url: string): string {
  if (!url) return "";
  

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  return url;
}


export function getYouTubeEmbedUrl(youtubeId: string, autoplay: boolean = false): string {
  if (!youtubeId) return "";
  
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    autoplay: autoplay ? '1' : '0'
  });
  
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}


export function getYouTubeWatchUrl(youtubeId: string): string {
  if (!youtubeId) return "";
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}


export interface YouTubeUrlInfo {
  id: string;
  isValid: boolean;
  type: 'video' | 'live' | 'short' | 'embed' | 'unknown';
  url: string;
  embedUrl: string;
  watchUrl: string;
  thumbnails: ReturnType<typeof getAllYouTubeThumbnails>;
}

export function parseYouTubeUrl(url: string): YouTubeUrlInfo {
  const id = extractYouTubeId(url);
  const isValid = isValidYouTubeId(id);
  
  let type: YouTubeUrlInfo['type'] = 'unknown';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('/live/')) {
    type = 'live';
  } else if (lowerUrl.includes('/shorts/')) {
    type = 'short';
  } else if (lowerUrl.includes('/embed/')) {
    type = 'embed';
  } else if (id) {
    type = 'video';
  }
  
  return {
    id,
    isValid,
    type,
    url: normalizeYouTubeUrl(url),
    embedUrl: getYouTubeEmbedUrl(id),
    watchUrl: getYouTubeWatchUrl(id),
    thumbnails: getAllYouTubeThumbnails(id)
  };
}