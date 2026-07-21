"use client";

import { useState, useCallback } from 'react';
import { SermonCard } from './SermonCard';
import { SearchFilter } from './SearchFilter';
import { LoadMoreButton } from './LoadMoreButton';
import { Sermon } from '@/lib/types/sermon';

interface SermonsListProps {
  initialSermons: (Sermon & { formattedDate?: string; originalDate?: string })[];
  initialCount: number;
  totalSermons: number;
}

export default function SermonsList({ 
  initialSermons, 
  initialCount, 
  totalSermons 
}: SermonsListProps) {
  const [sermons, setSermons] = useState(initialSermons);
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialSermons.length < totalSermons);

  const handleSearchResults = useCallback((searchResults: Sermon[]) => {
    setSermons(searchResults);
    setDisplayCount(searchResults.length);
    setHasMore(false); // Disable load more during search
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleLoadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Calculate current page
      const currentPage = Math.ceil(sermons.length / 4) + 1;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sermons?page=${currentPage}&limit=4`
      );
      
      if (response.ok) {
        const data = await response.json();
        const newSermons = data.data
          .filter((sermon: Sermon) => sermon.published)
          .map((sermon: Sermon) => ({
            ...sermon,
            formattedDate: new Date(sermon.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            originalDate: sermon.date
          }));
        
        setSermons([...sermons, ...newSermons]);
        setDisplayCount(sermons.length + newSermons.length);
        
        // Check if there are more sermons to load
        setHasMore(sermons.length + newSermons.length < totalSermons);
      }
    } catch (error) {
      console.error('Error loading more sermons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Search & Filter */}
      <SearchFilter 
        onSearchResults={handleSearchResults}
        onLoading={handleLoading}
      />
      
      {/* Loading state */}
      {isLoading && sermons.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-[#C80036] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading sermons...</p>
        </div>
      )}
      
      {/* No results state */}
      {!isLoading && sermons.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No sermons found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
      
      {/* Sermons Grid */}
      {sermons.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {sermons.map((sermon) => (
              <SermonCard 
                key={sermon.id} 
                sermon={{
                  id: sermon.id,
                  title: sermon.title,
                  pastor: sermon.pastor,
                  service: sermon.service,
                  date: sermon.formattedDate || sermon.date,
                  youtubeId: sermon.youtubeId,
                  duration: sermon.duration,
                  description: sermon.description
                }}
              />
            ))}
          </div>
          
          {/* Load More - Only show if not searching/filtering */}
          {hasMore && displayCount === sermons.length && (
            <LoadMoreButton 
              currentCount={displayCount}
              totalCount={totalSermons}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </>
  );
}