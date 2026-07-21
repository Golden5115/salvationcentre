/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  UserPlus,
  Users,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import type { FirstTimer } from "@/lib/types/first-timer"
import type { AdminUser } from "@/lib/types/admin"
import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"
import { getFirstTimers, deleteFirstTimer } from "@/lib/api/first-timers"
import { getCurrentUser, logout as apiLogout } from "@/lib/api/auth"

// Extended interface 
interface FirstTimerWithFollowUp extends FirstTimer {
  assignedTo?: string;
  followUpDate?: string;
  followUpNotes?: string;
}

// Define proper response structure
interface ApiResponse {
  success: boolean;
  data?: FirstTimerWithFollowUp[] | Record<string, unknown>;
  error?: string;
}

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
          toast.success("Welcome back!", {
            description: `Logged in as ${result.user.name}`,
            duration: 3000,
          })
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

export default function FirstTimersPage() {
  const router = useRouter()
  const { user, loading: authLoading,} = useAuth()
  const [firstTimers, setFirstTimers] = useState<FirstTimerWithFollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFollowUpStatus, setFilterFollowUpStatus] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login')
    }
  }, [authLoading, user, router])

  // Fetch first-timers data
  const fetchFirstTimers = async () => {
    setLoading(true)
    setError(null)
    
    const loadingToast = toast.loading("Loading first-timers...", {
      description: "Please wait while we fetch the data",
    })
    
    try {
      const res = await getFirstTimers() as ApiResponse
      console.log("API Response:", res) 
      if (res && res.success) {
        toast.dismiss(loadingToast)
        
        if (Array.isArray(res.data)) {
          setFirstTimers(res.data as FirstTimerWithFollowUp[])
          toast.success("Data loaded successfully", {
            description: `Loaded ${res.data.length} first-timer(s)`,
            duration: 3000,
          })
        } else if (res.data && typeof res.data === 'object') {
        
          const data = res.data as Record<string, unknown>
          if (Array.isArray(data.firstTimers)) {
            setFirstTimers(data.firstTimers as FirstTimerWithFollowUp[])
            toast.success("Data loaded successfully", {
              description: `Loaded ${data.firstTimers.length} first-timer(s)`,
              duration: 3000,
            })
          } else if (Array.isArray(data.items)) {
            setFirstTimers(data.items as FirstTimerWithFollowUp[])
            toast.success("Data loaded successfully", {
              description: `Loaded ${data.items.length} first-timer(s)`,
              duration: 3000,
            })
          } else if (Array.isArray(data.results)) {
            setFirstTimers(data.results as FirstTimerWithFollowUp[])
            toast.success("Data loaded successfully", {
              description: `Loaded ${data.results.length} first-timer(s)`,
              duration: 3000,
            })
          } else {
            const dataObject = data as unknown as FirstTimerWithFollowUp
            setFirstTimers([dataObject])
            toast.success("Data loaded successfully", {
              description: "Loaded 1 first-timer",
              duration: 3000,
            })
          }
        } else {
          setFirstTimers([])
          console.warn("Unexpected API response format:", res)
          toast.info("No data found", {
            description: "No first-timers in the database yet",
            duration: 3000,
          })
        }
      } else {
        toast.dismiss(loadingToast)
        const errorMsg = res?.error || "Failed to fetch first-timers"
        setError(errorMsg)
        toast.error("Failed to load data", {
          description: errorMsg,
          duration: 5000,
        })
        console.error("API Error:", res?.error)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      const errorMsg = "Failed to load first-timers. Please try again."
      console.error("Error fetching first-timers:", error)
      setError(errorMsg)
      toast.error("Connection error", {
        description: errorMsg,
        duration: 5000,
      })
      setFirstTimers([]) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchFirstTimers()
    }
  }, [user])

  const handleDelete = async (id: string) => {
    const person = firstTimers.find(p => p.id === id)
    const personName = person ? `${person.firstName} ${person.lastName}` : "this first-timer"
    
    setDeletingId(id)
    const t = toast.loading(`Deleting "${personName}"...`)
    try {
      const res = await deleteFirstTimer(id) as ApiResponse
      
      if (res.success) {
        setFirstTimers(prev => prev.filter(person => person.id !== id))
        toast.dismiss(t)
        toast.success(`${personName} has been deleted successfully`)
      } else {
        toast.dismiss(t)
        toast.error(res.error || "Failed to delete first-timer")
      }
    } catch (error) {
      toast.dismiss(t)
      toast.error("Failed to delete first-timer")
    } finally {
      setDeletingId(null)
    }
  }

  const handleMarkAsContacted = async (id: string) => {
    try {
      const person = firstTimers.find(p => p.id === id)
      if (person) {
        toast.info("Navigate to follow-up", {
          description: `Taking you to ${person.firstName}'s follow-up page`,
          duration: 2000,
        })
      }
      router.push(`/admin/first-timers/${id}/follow-up`)
    } catch (error) {
      console.error("Error updating follow-up status:", error)
      toast.error("Navigation failed", {
        description: "Could not navigate to follow-up page",
        duration: 3000,
      })
    }
  }

  // Handle edit details
  const handleEditDetails = (id: string) => {
    const person = firstTimers.find(p => p.id === id)
    if (person) {
      toast.info("Edit details", {
        description: `Editing ${person.firstName}'s information`,
        duration: 2000,
      })
    }
    router.push(`/admin/first-timers/${id}/follow-up`)
  }

  const filteredFirstTimers = Array.isArray(firstTimers) ? firstTimers.filter((person) => {
    const matchesSearch =
      person.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.phone && person.phone.includes(searchTerm)) ||
      (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFollowUpStatus = filterFollowUpStatus === "all" || person.followUpStatus === filterFollowUpStatus
    const matchesStatus = filterStatus === "all" || person.status === filterStatus
    return matchesSearch && matchesFollowUpStatus && matchesStatus
  }) : []

  // Calculate stats 
  const stats = {
    total: Array.isArray(firstTimers) ? firstTimers.length : 0,
    new: Array.isArray(firstTimers) ? firstTimers.filter((p) => p.status === "new").length : 0,
    pendingFollowUp: Array.isArray(firstTimers) ? firstTimers.filter((p) => p.followUpStatus === "pending").length : 0,
    members: Array.isArray(firstTimers) ? firstTimers.filter((p) => p.status === "member").length : 0,
  }

  // Navigation functions
  const navigateToAddFirstTimer = () => {
    toast.info("Add new first-timer", {
      description: "Navigating to add new visitor form",
      duration: 2000,
    })
    router.push("/admin/first-timers/add")
  }

  const navigateToFollowUp = (id: string) => {
    const person = firstTimers.find(p => p.id === id)
    if (person) {
      toast.info("Follow-up status", {
        description: `Updating ${person.firstName}'s follow-up status`,
        duration: 2000,
      })
    }
    router.push(`/admin/first-timers/${id}/follow-up`)
  }

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
              <p className="text-2xl font-black mb-2 text-center">Loading First-Timers</p>
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
                  First-Timers<br />
                  <span className="italic font-light">Management</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Track and follow up with first-time visitors to the church.
                </p>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search first-timers by name, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={fetchFirstTimers}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 py-5 px-10 bg-white border-4 border-black rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    <span className="font-black uppercase tracking-wider text-sm">Refresh</span>
                  </button>
                  <button
                    onClick={navigateToAddFirstTimer}
                    className="flex items-center justify-center gap-3 py-5 px-10 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:border-gray-800"
                  >
                    <Plus className="w-6 h-6" />
                    Add First-Timer
                  </button>
                </div>
              </div>

              {/* Stats - Keeping original structure but updating styling */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">Total</p>
                  <p className="text-4xl font-black text-black">{stats.total}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">New</p>
                  <p className="text-4xl font-black text-blue-600">{stats.new}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-yellow-600 text-sm font-bold uppercase tracking-wider mb-2">Pending Follow-Up</p>
                  <p className="text-4xl font-black text-yellow-600">{stats.pendingFollowUp}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-2">Now Members</p>
                  <p className="text-4xl font-black text-green-600">{stats.members}</p>
                </div>
              </div>

              {/* Filters - Keeping original structure but updating styling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm"
                  />
                </div>

                {/* Follow-Up Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <select
                    value={filterFollowUpStatus}
                    onChange={(e) => setFilterFollowUpStatus(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Follow-Up Status</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="member">Member</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-red-50/95 backdrop-blur-sm border-4 border-red-600 rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-900 font-black text-xl mb-2">Error loading first-timers</p>
                      <p className="text-red-700">{error}</p>
                    </div>
                    <button
                      onClick={fetchFirstTimers}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all border-4 border-red-600 hover:border-red-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-32">
                  <div className="text-black flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin" />
                    <div>
                      <p className="text-2xl font-black mb-2 text-center">Loading First-Timers</p>
                      <div className="w-12 h-1 bg-black mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* First-Timers List */}
              {!loading && !error && (
                <div className="space-y-6">
                  {filteredFirstTimers.map((person) => (
                    <div key={person.id} className="group">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative hover:-translate-y-2 transition-all duration-300">
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                        
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Left Side - Personal Info */}
                          <div className="flex-1 space-y-6">
                            {/* Header with name and badges */}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <h3 className="text-2xl font-black text-gray-900">
                                    {person.firstName} {person.lastName}
                                  </h3>
                                  {person.interestedInMembership && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 border-2 border-green-800 font-bold uppercase tracking-wider text-xs">
                                      <UserPlus className="w-4 h-4" />
                                      Interested in Membership
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border-2 ${
                                      person.status === "new"
                                        ? "bg-blue-100 text-blue-800 border-blue-800"
                                        : person.status === "contacted"
                                          ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                                          : person.status === "member"
                                            ? "bg-green-100 text-green-800 border-green-800"
                                            : "bg-gray-100 text-gray-800 border-gray-800"
                                    }`}
                                  >
                                    {person.status || "unknown"}
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border-2 ${
                                      person.followUpStatus === "pending"
                                        ? "bg-orange-100 text-orange-800 border-orange-800"
                                        : person.followUpStatus === "contacted"
                                          ? "bg-blue-100 text-blue-800 border-blue-800"
                                          : person.followUpStatus === "scheduled"
                                            ? "bg-purple-100 text-purple-800 border-purple-800"
                                            : "bg-green-100 text-green-800 border-green-800"
                                    }`}
                                  >
                                    {person.followUpStatus === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                    {person.followUpStatus === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {person.followUpStatus || "unknown"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Contact Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-bold text-gray-900">Phone</p>
                                  <p className="text-gray-700">{person.phone || "N/A"}</p>
                                </div>
                              </div>
                              {person.email && (
                                <div className="flex items-center gap-3">
                                  <Mail className="w-5 h-5 text-black" />
                                  <div>
                                    <p className="font-bold text-gray-900">Email</p>
                                    <p className="text-gray-700">{person.email}</p>
                                  </div>
                                </div>
                              )}
                              {(person.address || person.city) && (
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-5 h-5 text-black" />
                                  <div>
                                    <p className="font-bold text-gray-900">Address</p>
                                    <p className="text-gray-700">
                                      {person.address ? `${person.address}, ${person.city || ""}` : person.city || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-bold text-gray-900">Visit Date</p>
                                  <p className="text-gray-700">{person.visitDate ? new Date(person.visitDate).toLocaleDateString() : "N/A"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-black" />
                                <div>
                                  <p className="font-bold text-gray-900">Demographics</p>
                                  <p className="text-gray-700">
                                    {person.gender || "N/A"} • {person.maritalStatus || "N/A"}
                                  </p>
                                </div>
                              </div>
                              {person.occupation && (
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-bold text-gray-900">Occupation</p>
                                    <p className="text-gray-700">{person.occupation}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {person.howDidYouHear && (
                              <div className="border-t-2 border-gray-200 pt-4">
                                <p className="font-bold text-gray-900 mb-1">How they heard about us</p>
                                <p className="text-gray-700">{person.howDidYouHear}</p>
                              </div>
                            )}

                            {person.prayerRequest && (
                              <div className="border-t-2 border-gray-200 pt-4">
                                <div className="flex items-start gap-3">
                                  <Heart className="w-5 h-5 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="font-bold text-gray-900 mb-1">Prayer Request</p>
                                    <p className="text-gray-700 leading-relaxed">{person.prayerRequest}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Side - Follow-Up Info & Actions */}
                          <div className="lg:w-96 space-y-6">
                            {/* Follow-up Actions Card */}
                            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
                              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-4">Follow-up Actions</p>
                              <div className="space-y-3">
                                <button
                                  onClick={() => navigateToFollowUp(person.id)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-blue-600 hover:border-blue-700"
                                >
                                  <Users className="w-5 h-5" />
                                  Update Follow-up Status
                                </button>
                                
                                <div className="flex flex-col gap-2">
                                  {person.followUpStatus === "pending" && (
                                    <button
                                      onClick={() => handleMarkAsContacted(person.id)}
                                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-green-600 hover:border-green-700"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                      Mark as Contacted
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleEditDetails(person.id)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wider transition-all border-2 border-black hover:border-gray-800"
                                  >
                                    <Edit className="w-5 h-5" />
                                    Edit Details
                                  </button>
                                  <button
                                    onClick={() => handleDelete(person.id)}
                                    disabled={deletingId === person.id}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-red-600 hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {deletingId === person.id ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-5 h-5" />
                                    )}
                                    {deletingId === person.id ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Assigned To Card */}
                            {person.assignedTo && (
                              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
                                <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">Assigned To</p>
                                <p className="text-gray-900 font-black text-lg mb-4">{person.assignedTo}</p>
                                {person.followUpDate && (
                                  <div className="mb-3">
                                    <p className="font-bold text-gray-900 text-sm mb-1">Follow-up Date</p>
                                    <p className="text-gray-700">
                                      {new Date(person.followUpDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                )}
                                {person.followUpNotes && (
                                  <div className="border-t-2 border-gray-200 pt-4">
                                    <p className="font-bold text-gray-900 text-sm mb-1">Notes</p>
                                    <p className="text-gray-700 text-sm">{person.followUpNotes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredFirstTimers.length === 0 && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border-4 border-black text-center">
                  <div className="inline-block border-4 border-black p-8 mb-6">
                    <Users className="w-16 h-16 text-black" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-black">
                    {firstTimers.length === 0 ? "No first-timers yet" : "No first-timers found"}
                  </h3>
                  <p className="text-gray-700 text-lg max-w-md mx-auto mb-6">
                    {firstTimers.length === 0
                      ? "Start by adding your first first-timer visitor to the church"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {firstTimers.length === 0 && (
                    <button
                      onClick={navigateToAddFirstTimer}
                      className="px-10 py-5 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:border-gray-800"
                    >
                      <Plus className="w-6 h-6 inline-block mr-3" />
                      Add First First-Timer
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}