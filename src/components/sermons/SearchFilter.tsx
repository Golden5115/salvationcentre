"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { Sermon, ServiceType, SermonsResponse } from "@/lib/types/sermon";

interface SearchFilterProps {
  onSearchResults?: (sermons: Sermon[]) => void;
  onLoading?: (loading: boolean) => void;
}

export function SearchFilter({ 
  onSearchResults, 
  onLoading 
}: SearchFilterProps) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLoading = useCallback((isLoading: boolean) => {
    if (onLoading) {
      onLoading(isLoading);
    }
  }, [onLoading]);

  const handleSearchResults = useCallback((results: Sermon[]) => {
    if (onSearchResults) {
      onSearchResults(results);
    }
  }, [onSearchResults]);

  // Fetch service types from backend
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await apiRequest<{ data: ServiceType[] }>("/api/service-types");
        
        if (res.success && res.data) {
          // Handle different response structures
          if (Array.isArray(res.data)) {
            setServiceTypes(res.data);
          } else if (res.data.data && Array.isArray(res.data.data)) {
            setServiceTypes(res.data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch service types:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    handleLoading(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let endpoint = "/api/sermons";
        const params = new URLSearchParams();
        
        if (search.trim()) {
          params.append("q", search.trim());
          endpoint = "/api/sermons/search";
        }
        
        if (selectedService) {
          params.append("service", selectedService);
        }
        
        const url = params.toString() 
          ? `${endpoint}?${params.toString()}`
          : endpoint;
        
        const res = await apiRequest<SermonsResponse>(url);
        
        if (res.success && res.data) {
          // Format dates for display
          const sermonsWithFormattedDates = (res.data.data || []).map((sermon: Sermon) => ({
            ...sermon,
            date: new Date(sermon.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }));
          
          handleSearchResults(sermonsWithFormattedDates);
        }
      } catch (error) {
        console.error("Search error:", error);
        handleSearchResults([]);
      } finally {
        handleLoading(false);
      }
    }, 500); 
    
    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, selectedService, handleLoading, handleSearchResults]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedService("");
  };

  return (
    <div className="mb-16 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search sermons by title, pastor, or description..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036] focus:border-transparent transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <select
          value={selectedService}
          onChange={handleServiceChange}
          disabled={loading}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036] focus:border-transparent bg-white transition-all min-w-[180px]"
        >
          <option value="">All Services</option>
          {serviceTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        {(search || selectedService) && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-3 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}