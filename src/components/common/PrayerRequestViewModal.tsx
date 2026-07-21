// components/common/PrayerRequestViewModal.tsx
import { X, Mail, Calendar, Clock, User } from "lucide-react"
import type { PrayerRequest } from "@/lib/types/prayer-request"

interface PrayerRequestViewModalProps {
  request: PrayerRequest
  isOpen: boolean
  onClose: () => void
}

export default function PrayerRequestViewModal({ 
  request, 
  isOpen, 
  onClose 
}: PrayerRequestViewModalProps) {
  if (!isOpen) return null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    prayed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    archived: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0C1844] border border-white/10 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0C1844]/95 backdrop-blur-md border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white font-teko">Prayer Request Details</h2>
            <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${statusColors[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Submitter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <User className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Submitted by</p>
                <p className="text-white text-lg font-medium">{request.name}</p>
              </div>
            </div>

            {request.email && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Mail className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white text-lg font-medium break-all">{request.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Calendar className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Submitted on</p>
                <p className="text-white text-base">{formatDate(request.submittedAt)}</p>
              </div>
            </div>

            {request.updatedAt && request.status !== 'pending' && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Clock className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Last updated</p>
                  <p className="text-white text-base">{formatDate(request.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Prayer Request Message */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Prayer Request</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                {request.request}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#C80036]/10 hover:bg-[#C80036]/20 border border-[#C80036]/30 text-[#C80036] rounded-xl font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}