"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { FirstTimer } from "@/lib/types/first-timer"
import SubmitButton from "@/components/common/SubmitButton"

interface FirstTimerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<FirstTimer>) => void
  title: string
  submitText?: string
  isLoading?: boolean
}

export default function FirstTimerFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText = "Submit",
  isLoading = false,
}: FirstTimerFormModalProps) {
  const [formData, setFormData] = useState<Partial<FirstTimer>>({
    interestedInMembership: false,
  })

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Modal Container - Responsive height & width */}
      <div className="relative w-full max-w-lg md:max-w-4xl h-[90dvh] md:h-auto md:max-h-[90vh] bg-gray-900 border border-white/20 rounded-2xl shadow-2xl flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gray-900 shrink-0">
          <h2 className="text-white text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="first-timer-form" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-white/90 text-sm font-semibold mb-4 uppercase tracking-wide">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">First Name *</label>
                  <input
                    name="firstName"
                    required
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Last Name *</label>
                  <input
                    name="lastName"
                    required
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Separated">Separated</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
              <h3 className="text-white/90 text-sm font-semibold mb-4 uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="+234 801 234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">City</label>
                  <input
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="Lagos"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">State</label>
                  <input
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="Lagos"
                  />
                </div>
              </div>
            </div>

            {/* Visit Information Section */}
            <div className="mb-6">
              <h3 className="text-white/90 text-sm font-semibold mb-4 uppercase tracking-wide">
                Visit Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Visit Date *</label>
                  <input
                    name="visitDate"
                    required
                    type="date"
                    value={formData.visitDate || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">How Did You Hear About Us?</label>
                  <input
                    name="howDidYouHear"
                    value={formData.howDidYouHear || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition"
                    placeholder="Friend, flyer, social media..."
                  />
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-white/90 text-sm font-semibold mb-4 uppercase tracking-wide">
                Additional Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Prayer Request (Optional)</label>
                  <textarea
                    name="prayerRequest"
                    rows={3}
                    value={formData.prayerRequest || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:bg-white/10 focus:outline-none transition resize-none"
                    placeholder="Share your prayer needs..."
                  />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    name="interestedInMembership"
                    checked={formData.interestedInMembership || false}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-red-500 focus:ring-red-500/50 focus:ring-2"
                  />
                  <label className="text-white/80 text-sm font-medium">
                    Interested in becoming a member
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-white/10 bg-gray-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-white/20 text-white/70 hover:bg-white/5 hover:text-white transition font-medium"
          >
            Cancel
          </button>
          <SubmitButton
            variant="primary"
            type="submit"
            form="first-timer-form"
            disabled={isLoading}
            isLoading={isLoading}
            loadingText="Submitting..."
            className="px-6 py-2.5"
          >
            {submitText}
          </SubmitButton>
        </div>
      </div>
    </div>
  )
}