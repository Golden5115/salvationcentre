"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import SubmitButton from "@/components/common/SubmitButton"
import { updateFirstTimer, getFirstTimers } from "../../../../../lib/api/first-timers"
import { getCurrentUser, logout as apiLogout } from "@/lib/api/auth"
import type { AdminUser } from "@/lib/types/admin"
import { Header } from "@/components/admin/header"
import { Sidebar } from "@/components/admin/sidebar"

// Proper authentication hook
const useAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setLoading(true)
        const result = await getCurrentUser()
        
        if (result.success && result.user) {
          setUser(result.user)
        } else {
          // If not authenticated, redirect to login
          toast.error("Session expired", {
            description: "Please log in again",
            duration: 3000,
          })
          router.push('/admin/login')
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        toast.error("Authentication failed", {
          description: "Please log in again",
          duration: 3000,
        })
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const logout = async () => {
    try {
      const loadingToast = toast.loading("Logging out...")
      await apiLogout()
      toast.dismiss(loadingToast)
      toast.success("Logged out successfully", {
        duration: 3000,
      })
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed", {
        description: "Please try again",
        duration: 3000,
      })
    }
  }

  return { user, loading, logout }
}

export default function FollowUpPage() {
  const router = useRouter()
  const { id } = useParams()
  const { user, loading: authLoading} = useAuth()
  const [formData, setFormData] = useState({ followUpStatus: "pending", status: "new" })
  const [isLoading, setIsLoading] = useState(false)
  const [personName, setPersonName] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    const t = toast.loading("Logging out...")
    const result = await apiLogout()
    toast.dismiss(t)
    if (result.success) {
      toast.success("Logged out successfully")
      router.push("/admin/login")
    } else {
      toast.error("Logout failed")
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      
      setIsLoadingData(true)
      const loadingToast = toast.loading("Loading visitor data...")
      
      try {
        const res = await getFirstTimers()
        if (res.success && res.data) {
          const person = res.data.find(p => p.id === id)
          if (person) {
            setFormData({
              followUpStatus: person.followUpStatus || "pending",
              status: person.status || "new"
            })
            if (person.firstName) {
              setPersonName(`${person.firstName} ${person.lastName || ""}`.trim())
            }
            toast.dismiss(loadingToast)
            toast.success("Data loaded", {
              description: `Ready to update ${person.firstName}'s status`,
              duration: 3000
            })
          } else {
            toast.dismiss(loadingToast)
            toast.error("Visitor not found", {
              description: "The requested visitor could not be found",
              action: {
                label: "Go Back",
                onClick: () => router.push("/admin/first-timers")
              }
            })
            setTimeout(() => router.push("/admin/first-timers"), 3000)
          }
        } else {
          toast.dismiss(loadingToast)
          toast.error("Failed to load data", {
            description: res.error || "Please try again later",
            action: {
              label: "Retry",
              onClick: () => loadData()
            }
          })
        }
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("Connection error", {
          description: "Unable to connect to server",
          action: {
            label: "Retry",
            onClick: () => loadData()
          }
        })
        console.error("Error loading first-timers:", error)
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [id, router, user])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Show a quick preview toast for status changes
    if (name === "followUpStatus") {
      const statusMessages: Record<string, string> = {
        pending: "Follow-up pending",
        contacted: "Visitor contacted",
        scheduled: "Meeting scheduled",
        completed: "Follow-up completed"
      }
      if (statusMessages[value]) {
        toast.info(statusMessages[value], {
          duration: 2000
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const loadingToast = toast.loading("Updating status...", {
      description: "Please wait while we save the changes"
    })
    
    try {
      const res = await updateFirstTimer(id as string, formData)
      
      if (res.success) {
        toast.dismiss(loadingToast)
        toast.success("Status updated successfully!", {
          description: `${personName || "Visitor"} is now marked as ${formData.status}`,
          action: {
            label: "View All",
            onClick: () => router.push("/admin/first-timers")
          },
          duration: 4000,
        })
        
        // Delay navigation to show success message
        setTimeout(() => {
          router.push("/admin/first-timers")
        }, 2000)
      } else {
        toast.dismiss(loadingToast)
        toast.error("Update failed", {
          description: res.error || "Please try again",
          action: {
            label: "Retry",
            onClick: () => handleSubmit(e)
          }
        })
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Unexpected error", {
        description: "Please try again or contact support",
      })
      console.error("Error updating first-timer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statusColors = {
    pending: "text-yellow-600",
    contacted: "text-blue-600",
    scheduled: "text-purple-600",
    completed: "text-green-600",
    new: "text-yellow-600",
    "followed up": "text-blue-600",
    member: "text-green-600"
  }

  // Show loading while checking authentication
  if (authLoading || !mounted) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxlyd19av/image/upload/v1769007763/Modern_black_office_desk_with_office_supplies_and_copy_space_for_presentation_background___Premium_Photo_uqdpzg.jpg"
            alt="Modern office background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/90 to-black/95 z-10" />
        </div>

        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-white flex flex-col items-center gap-6">
            <Loader2 className="w-16 h-16 animate-spin" />
            <div>
              <p className="text-2xl font-black mb-2 text-center">Loading</p>
              <div className="w-12 h-1 bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxlyd19av/image/upload/v1769007763/Modern_black_office_desk_with_office_supplies_and_copy_space_for_presentation_background___Premium_Photo_uqdpzg.jpg"
            alt="Modern office background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/90 to-black/95 z-10" />
        </div>

        <div className="relative z-20">
          <Sidebar
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
          />

          <main className="lg:pl-64">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              user={user}
              onLogout={handleLogout}
            />

            <div className="p-6 lg:p-8">
              <div className="max-w-4xl mx-auto">
                {/* Page Header - Updated to match Events page style */}
                <div className="mb-10">
                  <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                    <span className="text-white font-bold uppercase tracking-widest text-xs">Admin</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    Update<br />
                    <span className="italic font-light">Follow-up Status</span>
                  </h1>
                  <div className="w-24 h-1 bg-white mb-6"></div>
                  <p className="text-lg text-white/80 max-w-3xl font-light">
                    Update the follow-up status and visitor classification for {personName || "this visitor"}.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-white/70 hover:text-white mb-10 transition-all group"
                    disabled={isLoading}
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition">
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="font-medium">Back to Visitors</span>
                  </button>

                  {/* Visitor Info Card */}
                  <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl shadow-2xl p-8 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-red-600 border-2 border-red-800 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">
                          {personName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-black text-xl">{personName || "Loading..."}</p>
                        <p className="text-gray-600 text-sm font-medium">Visitor ID: {id?.toString().slice(-6)}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Follow-up Status Card */}
                    <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl shadow-2xl p-8">
                      <div className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        Follow-up Status
                      </div>
                      <select
                        name="followUpStatus"
                        value={formData.followUpStatus}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium appearance-none cursor-pointer"
                        disabled={isLoading || isLoadingData}
                      >
                        <option value="pending" className="bg-white">Pending</option>
                        <option value="contacted" className="bg-white">Contacted</option>
                        <option value="scheduled" className="bg-white">Scheduled</option>
                        <option value="completed" className="bg-white">Completed</option>
                      </select>
                      <div className="mt-6">
                        <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">Current Status</p>
                        <span className={`text-xl font-black ${statusColors[formData.followUpStatus as keyof typeof statusColors]}`}>
                          {formData.followUpStatus.charAt(0).toUpperCase() + formData.followUpStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-6">
                        Track the progress of your follow-up communication with this visitor
                      </p>
                    </div>

                    {/* Visitor Status Card */}
                    <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl shadow-2xl p-8">
                      <div className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        Visitor Status
                      </div>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium appearance-none cursor-pointer"
                        disabled={isLoading || isLoadingData}
                      >
                        <option value="new" className="bg-white">New Visitor</option>
                        <option value="followed up" className="bg-white">Followed Up</option>
                        <option value="member" className="bg-white">Became Member</option>
                      </select>
                      <div className="mt-6">
                        <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">Current Status</p>
                        <span className={`text-xl font-black ${statusColors[formData.status as keyof typeof statusColors]}`}>
                          {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-6">
                        Update the overall classification of this visitor in the system
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-6 pt-8 border-t-2 border-white/20">
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.followUpStatus !== "pending" || formData.status !== "new") {
                            toast.warning("Changes not saved", {
                              description: "Your updates will be lost",
                              action: {
                                label: "Stay",
                                onClick: () => {}
                              },
                              duration: 5000
                            })
                          }
                          router.back()
                        }}
                        className="px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-900 hover:text-gray-950 bg-white hover:bg-gray-50 transition-all font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <SubmitButton 
                        isLoading={isLoading} 
                        className="px-8 py-4 rounded-xl bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wider transition-all border-2 border-black hover:border-gray-800 hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isLoadingData}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Update Status
                        </span>
                      </SubmitButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}