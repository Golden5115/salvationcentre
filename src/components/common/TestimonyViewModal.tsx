
import { X, User, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import type { Testimony } from "@/lib/types/testimonies"

interface TestimonyViewModalProps {
  testimony: Testimony
  isOpen: boolean
  onClose: () => void
}

export default function TestimonyViewModal({ 
  testimony, 
  isOpen, 
  onClose 
}: TestimonyViewModalProps) {
  if (!isOpen) return null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',       
      minute: '2-digit',
      hour12: true            
    })
  }

  const statusConfig = {
    pending: {
      label: "Pending Review",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: Clock
    },
    approved: {
      label: "Approved",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle
    },
    rejected: {
      label: "Rejected",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: XCircle
    }
  }

  const status = statusConfig[testimony.status]
  const StatusIcon = status.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0C1844] border border-white/10 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0C1844]/95 backdrop-blur-md border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white font-teko">Testimony Details</h2>
            <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
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
          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">{testimony.title}</h3>
          </div>

          {/* Submitter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <User className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Submitted by</p>
                <p className="text-white text-lg font-medium">{testimony.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Calendar className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Submitted on</p>
                <p className="text-white text-base">{formatDate(testimony.submittedAt)}</p>
              </div>
            </div>
          </div>

          {/* Approval Date  */}
          {testimony.approvedAt && testimony.status === 'approved' && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Approved on</p>
                <p className="text-white text-base">{formatDate(testimony.approvedAt)}</p>
              </div>
            </div>
          )}

          {/* Testimony Message */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Full Testimony</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                {testimony.message}
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