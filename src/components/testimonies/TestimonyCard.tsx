"use client"

import { Calendar, User, Share2, Quote } from 'lucide-react'
import { toast } from 'sonner'
import type { Testimony } from '@/lib/types/testimonies'

interface TestimonyCardProps {
  testimony: Testimony
}

export function TestimonyCard({ testimony }: TestimonyCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get first name only
  const firstName = testimony.name.split(' ')[0]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: testimony.title,
        text: testimony.message.substring(0, 100) + '...',
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link Copied!', {
        description: 'Testimony link copied to clipboard',
      })
    }
  }

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-[#C80036]/10 via-purple-600/5 to-[#0C1844]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Main Card */}
      <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5 h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#C80036] to-[#0C1844] flex items-center justify-center shrink-0">
                  <Quote className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {testimony.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="font-medium">{firstName}</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(testimony.submittedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Share testimony"
              title="Share testimony"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
              {testimony.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}