"use client";

import { useState } from 'react';

interface LoadMoreButtonProps {
  currentCount: number;
  totalCount: number;
  onLoadMore?: () => Promise<void>;
  isLoading?: boolean;
}

export function LoadMoreButton({ 
  currentCount, 
  totalCount, 
  onLoadMore, 
  isLoading = false 
}: LoadMoreButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (onLoadMore) {
      setLoading(true);
      try {
        await onLoadMore();
      } finally {
        setLoading(false);
      }
    }
  };

  if (currentCount >= totalCount || totalCount <= 4) {
    return null;
  }

  return (
    <div className="flex justify-center mt-16 animate-fade-in-up animate-delay-400">
      <button 
        onClick={handleLoadMore}
        disabled={loading || isLoading}
        className="px-8 py-3 bg-[#0C1844] text-white rounded-lg hover:bg-[#0C1844]/90 font-medium hover:scale-105 transform transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading || isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </>
        ) : (
          `Load More Sermons (${currentCount} of ${totalCount})`
        )}
      </button>
    </div>
  );
}