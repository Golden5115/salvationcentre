"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { FirstTimer } from "@/lib/types/first-timer"
import SubmitButton from "@/components/common/SubmitButton"
import { createFirstTimer } from "../../../../lib/api/first-timers"
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

export default function AddFirstTimerPage() {
  const router = useRouter()
  const { user, loading: authLoading} = useAuth()
  const [formData, setFormData] = useState<Partial<FirstTimer>>({
    interestedInMembership: false,
  })
  const [isLoading, setIsLoading] = useState(false)
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const loadingToast = toast.loading("Saving first-timer...", {
      description: "Please wait while we save the information"
    })
    
    try {
      const res = await createFirstTimer(formData)
      
      if (res.success) {
        toast.dismiss(loadingToast)
        toast.success("First-timer saved successfully!", {
          description: `${formData.firstName} ${formData.lastName} has been added to the database`,
          action: {
            label: "View All",
            onClick: () => router.push("/admin/first-timers")
          },
          duration: 4000,
        })
        
        // Clear form after successful submission
        setFormData({
          interestedInMembership: false,
        })
        
        setTimeout(() => {
          router.push("/admin/first-timers")
        }, 2000)
      } else {
        toast.dismiss(loadingToast)
        toast.error("Failed to save first-timer", {
          description: res.error || "Please check the information and try again",
          action: {
            label: "Retry",
            onClick: () => {
              // Create a synthetic event to retry
              const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
              handleSubmit(syntheticEvent)
            }
          }
        })
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Unexpected error occurred", {
        description: "Please try again or contact support",
        action: {
          label: "Report",
          onClick: () => console.error("First-timer creation error:", error)
        }
      })
      console.error("Error creating first-timer:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
              {/* Page Header - Updated to match Events page style */}
              <div className="mb-10">
                <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Admin</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Add New<br />
                  <span className="italic font-light">First-Timer</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Enter visitor information to add them to the database
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition group"
                >
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to List</span>
                </button>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Form Fields */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">First Name *</label>
                        <input
                          name="firstName"
                          required
                          value={formData.firstName || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="John"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Last Name *</label>
                        <input
                          name="lastName"
                          required
                          value={formData.lastName || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="Kolade"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Email</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Phone</label>
                        <input
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="(234) 456-7890"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">City</label>
                        <input
                          name="city"
                          value={formData.city || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="Ikeja"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">State</label>
                        <input
                          name="state"
                          value={formData.state || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="Lagos"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Visit Date *</label>
                        <input
                          name="visitDate"
                          required
                          type="date"
                          value={formData.visitDate || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-white">Select Gender</option>
                          <option value="Male" className="bg-white">Male</option>
                          <option value="Female" className="bg-white">Female</option>
                          <option value="Other" className="bg-white">Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Marital Status</label>
                        <select
                          name="maritalStatus"
                          value={formData.maritalStatus || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-white">Select Status</option>
                          <option value="Single" className="bg-white">Single</option>
                          <option value="Married" className="bg-white">Married</option>
                          <option value="Separated" className="bg-white">Separated</option>
                          <option value="Divorced" className="bg-white">Divorced</option>
                          <option value="Widowed" className="bg-white">Widowed</option>
                        </select>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">How Did You Hear?</label>
                        <input
                          name="howDidYouHear"
                          value={formData.howDidYouHear || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                          placeholder="Friend, Social Media, Website, etc."
                        />
                      </div>
                    </div>

                    {/* Additional Fields */}
                    <div className="space-y-8 pt-8 mt-8 border-t-2 border-gray-200">
                      <div className="space-y-3">
                        <label className="block text-gray-900 text-sm font-bold uppercase tracking-wider">Prayer Request</label>
                        <textarea
                          name="prayerRequest"
                          rows={4}
                          value={formData.prayerRequest || ""}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/20 font-medium resize-none"
                          placeholder="Enter any prayer requests or special needs..."
                        />
                      </div>

                      {/* Improved "Interested in Membership" checkbox */}
                      <div className="group cursor-pointer" onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        interestedInMembership: !prev.interestedInMembership 
                      }))}>
                        <div className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${
                          formData.interestedInMembership 
                            ? "bg-green-50 border-green-600 shadow-lg shadow-green-500/10" 
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}>
                          <div className="relative mt-1">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              formData.interestedInMembership 
                                ? "bg-green-600 shadow-lg shadow-green-500/30" 
                                : "bg-gray-300 border border-gray-400 group-hover:bg-gray-400"
                            }`}>
                              {formData.interestedInMembership && (
                                <Check className="w-4 h-4 text-white animate-scaleIn" strokeWidth={3} />
                              )}
                            </div>
                            {formData.interestedInMembership && (
                              <div className="absolute -inset-1 bg-green-500/20 rounded-lg blur-sm -z-10 animate-pulse-slow"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`font-bold text-lg transition-colors ${
                                formData.interestedInMembership ? "text-green-800" : "text-gray-900"
                              }`}>
                                {formData.interestedInMembership ? "Interested in Membership" : "Interested in Membership"}
                              </h3>
                              {formData.interestedInMembership && (
                                <span className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-full animate-fadeIn uppercase tracking-wider">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className={`text-sm transition-all duration-300 ${
                              formData.interestedInMembership 
                                ? "text-green-700" 
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}>
                              {formData.interestedInMembership 
                                ? "Visitor has expressed interest in becoming a church member. This will be tracked for follow-up."
                                : "Check if the visitor expressed interest in church membership for follow-up tracking."}
                            </p>
                            
                            {formData.interestedInMembership && (
                              <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300 animate-fadeIn">
                                <div className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-green-600" strokeWidth={2} />
                                  <span className="text-green-800 text-sm font-bold">Membership follow-up will be prioritized</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-center w-8">
                            {formData.interestedInMembership && (
                              <svg className="w-6 h-6 text-green-600 animate-fadeIn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-6 pt-6 border-t-2 border-white/20">
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Form cancelled", {
                          description: "No information was saved",
                          duration: 3000
                        })
                        router.back()
                      }}
                      className="px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-900 hover:text-gray-950 bg-white hover:bg-gray-50 transition-all font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <SubmitButton isLoading={isLoading} className="hover:scale-[1.02] active:scale-[0.98] transition-transform px-8 py-4 rounded-xl font-bold uppercase tracking-wider border-2 border-black hover:border-gray-800">
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Save First-Timer
                      </span>
                    </SubmitButton>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>

        {/* Add custom animation styles */}
        <style jsx global>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.5);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
          }
        `}</style>
      </div>
    </>
  )
}