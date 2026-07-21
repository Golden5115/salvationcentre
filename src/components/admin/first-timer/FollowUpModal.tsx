"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { FirstTimer } from "@/lib/types/first-timer"

interface FollowUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { followUpStatus?: string; status?: string }) => void
  initialData?: Pick<FirstTimer, "followUpStatus" | "status">
  title: string
  submitText?: string
}

export default function FollowUpModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  submitText = "Update",
}: FollowUpModalProps) {
  const [formData, setFormData] = useState({
    followUpStatus: initialData?.followUpStatus || "pending",
    status: initialData?.status || "new",
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-white/70 text-sm">Follow-up Status</label>
            <select
              name="followUpStatus"
              value={formData.followUpStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-white/70 text-sm">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="new">New</option>
              <option value="followed up">Followed Up</option>
              <option value="member">Member</option>
            </select>
          </div>
        </form>

        <div className="flex justify-end gap-4 p-6 border-t border-white/10">
          <button 
            onClick={onClose} 
            className="px-6 py-3 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  )
}