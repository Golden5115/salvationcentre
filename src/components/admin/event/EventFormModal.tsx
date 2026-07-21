/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Calendar as CalendarIcon, Clock, MapPin, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { createSpecialEvent, updateSpecialEvent } from "@/lib/api"
import type { SpecialEvent, CreateSpecialEventInput, UpdateSpecialEventInput } from "@/lib/types/special-event"

interface EventFormModalProps {
  event: SpecialEvent | null
  onClose: () => void
  onSuccess: () => void
}

export default function EventFormModal({ event, onClose, onSuccess }: EventFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    published: false,
  })

  const eventTypes = [
    "Conference",
    "Seminar",
    "Crusade",
    "Concert",
    "Outreach",
    "Retreat",
    "Workshop",
    "Other"
  ]

  useEffect(() => {
    if (event) {
      const dateObj = new Date(event.date)
      const formattedDate = dateObj.toISOString().split('T')[0]
      
      setFormData({
        title: event.title,
        type: event.type,
        description: event.description || "",
        date: formattedDate,
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        location: event.location || "",
        published: event.published,
      })
    } else {
      setFormData({
        title: "",
        type: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        published: false,
      })
    }
  }, [event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      const toastId = toast.loading(event ? "Updating event..." : "Creating event...")

      if (event) {
        const updateData: UpdateSpecialEventInput = {
          title: formData.title,
          type: formData.type,
          description: formData.description || undefined,
          date: formData.date,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          location: formData.location || undefined,
          published: formData.published,
        }
        
        const response = await updateSpecialEvent(event.id, updateData)
        
        if (response.success) {
          toast.success("Event updated successfully!", { id: toastId })
          onSuccess()
        } else {
          toast.error(`Failed to update event: ${response.error}`, { id: toastId })
        }
      } else {
        const createData: CreateSpecialEventInput = {
          title: formData.title,
          type: formData.type,
          description: formData.description || undefined,
          date: formData.date,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          location: formData.location || undefined,
          published: formData.published,
        }
        
        const response = await createSpecialEvent(createData)
        
        if (response.success) {
          toast.success("Event created successfully!", { id: toastId })
          onSuccess()
        } else {
          toast.error(`Failed to create event: ${response.error}`, { id: toastId })
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-2xl font-bold font-teko">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Event Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                placeholder="Enter event title"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Event Type <span className="text-red-400">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                required
              >
                <option value="" className="bg-gray-800 text-white">Select event type</option>
                {eventTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800 text-white py-2">{type}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                  placeholder="Enter event location"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
                placeholder="Enter event description"
              />
            </div>

            {/* Published */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                {formData.published ? (
                  <Eye className="w-5 h-5 text-emerald-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-white/60" />
                )}
                <span className="font-medium text-white/90">
                  {formData.published ? 'Published (Visible to public)' : 'Draft (Only visible in admin)'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? (
                  event ? 'Updating...' : 'Creating...'
                ) : (
                  event ? 'Update Event' : 'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}