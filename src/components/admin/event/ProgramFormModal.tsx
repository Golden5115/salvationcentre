/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Clock, MapPin, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { createRegularProgram, updateRegularProgram } from "@/lib/api"
import { getServiceTypes } from "@/lib/api/service-types"
import type { RegularProgram, CreateRegularProgramInput, UpdateRegularProgramInput } from "@/lib/types/regular-program"
import type { ServiceType } from "@/lib/types/service-type"

interface ProgramFormModalProps {
  program: RegularProgram | null
  onClose: () => void
  onSuccess: () => void
}

export default function ProgramFormModal({ program, onClose, onSuccess }: ProgramFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    day: "",
    frequency: "",
    time: "",
    location: "",
    type: "",
    active: true,
  })

  const dayOptions = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  const frequencyOptions = [
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "First week of month",
    "Last week of month",
    "Quarterly",
    "Annually"
  ]

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setLoadingTypes(true)
        const types = await getServiceTypes()
        setServiceTypes(types)
        
        if (types.length > 0 && !program) {
          setFormData(prev => ({ ...prev, type: types[0].name }))
        }
      } catch (error) {
        toast.error("Failed to load service types")
      } finally {
        setLoadingTypes(false)
      }
    }

    fetchServiceTypes()
  }, [program])

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title,
        description: program.description || "",
        day: program.day || "",
        frequency: program.frequency,
        time: program.time || "",
        location: program.location || "",
        type: program.type || "",
        active: program.active,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        day: "",
        frequency: "",
        time: "",
        location: "",
        type: serviceTypes.length > 0 ? serviceTypes[0].name : "",
        active: true,
      })
    }
  }, [program, serviceTypes])

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

      const toastId = toast.loading(program ? "Updating program..." : "Creating program...")

      if (program) {
        const updateData: UpdateRegularProgramInput = {
          title: formData.title,
          description: formData.description || undefined,
          day: formData.day,
          frequency: formData.frequency,
          time: formData.time || undefined,
          location: formData.location || undefined,
          type: formData.type,
          active: formData.active,
        }
        
        const response = await updateRegularProgram(program.id, updateData)
        
        if (response.success) {
          toast.success("Program updated successfully!", { id: toastId })
          onSuccess()
        } else {
          toast.error(`Failed to update program: ${response.error}`, { id: toastId })
        }
      } else {
        const createData: CreateRegularProgramInput = {
          title: formData.title,
          description: formData.description || undefined,
          day: formData.day,
          frequency: formData.frequency,
          time: formData.time || undefined,
          location: formData.location || undefined,
          type: formData.type,
          active: formData.active,
        }
        
        const response = await createRegularProgram(createData)
        
        if (response.success) {
          toast.success("Program created successfully!", { id: toastId })
          onSuccess()
        } else {
          toast.error(`Failed to create program: ${response.error}`, { id: toastId })
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
            {program ? 'Edit Program' : 'Create New Program'}
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
                Program Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                placeholder="Enter program title"
                required
              />
            </div>

            {/* Type - From API */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Program Type <span className="text-red-400">*</span>
              </label>
              {loadingTypes ? (
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading types...</span>
                </div>
              ) : serviceTypes.length > 0 ? (
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                  required
                >
                  <option value="" className="bg-gray-800 text-white">Select program type</option>
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.name} className="bg-gray-800 text-white py-2">
                      {type.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60">
                  No service types available. Please add service types first.
                </div>
              )}
            </div>

            {/* Day */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Day <span className="text-red-400">*</span>
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                required
              >
                <option value="" className="bg-gray-800 text-white">Select day</option>
                {dayOptions.map(day => (
                  <option key={day} value={day} className="bg-gray-800 text-white py-2">{day}</option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Frequency <span className="text-red-400">*</span>
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                required
              >
                <option value="" className="bg-gray-800 text-white">Select frequency</option>
                {frequencyOptions.map(option => (
                  <option key={option} value={option} className="bg-gray-800 text-white py-2">{option}</option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                  placeholder="e.g. 10:00 AM - 12:30 PM"
                />
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
                  placeholder="Enter program location"
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
                placeholder="Enter program description"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                {formData.active ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-white/60" />
                )}
                <span className="font-medium text-white/90">
                  {formData.active ? 'Active (Visible to public)' : 'Inactive (Hidden from public)'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
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
                disabled={loading || loadingTypes || serviceTypes.length === 0}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? (
                  program ? 'Updating...' : 'Creating...'
                ) : (
                  program ? 'Update Program' : 'Create Program'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}