"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Filter, Eye, Trash2, Check, X, RefreshCw, FileText } from 'lucide-react'
import { toast } from 'sonner'
import type { Testimony } from '@/lib/types/testimonies'
import { 
  getAllTestimonies, 
  updateTestimonyStatus, 
  deleteTestimony,
  getTestimonyStats 
} from '@/lib/api/testimonies'
import { getCurrentUser, logout } from '@/lib/api/auth'
import type { AdminUser } from '@/lib/types/admin'

import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import ConfirmModal from '@/components/common/ConfirmModal'
import TestimonyViewModal from '../../../components/common/TestimonyViewModal'

export default function TestimoniesPage() {
  const router = useRouter()

  // Auth state 
  const [user, setUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Page state
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  
  // View modal state
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null)

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => Promise<void>
    confirmColor: 'red' | 'blue' | 'green'
  } | null>(null)

  // Date formatter
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser()
      if (result.success && result.user) {
        setUser(result.user)
      } else {
        toast.error("Access denied", {
          description: "Please log in to continue"
        })
        router.push('/admin/login')
      }
      setAuthLoading(false)
    }
    fetchUser()
  }, [router])

  // Fetch testimonies
  const fetchData = async () => {
    const loadingToast = toast.loading("Loading testimonies...")
    try {
      setLoading(true)
      const [testimoniesData, statsData] = await Promise.all([
        getAllTestimonies(),
        getTestimonyStats()
      ])
      setTestimonies(testimoniesData)
      setStats(statsData)
      toast.dismiss(loadingToast)
      toast.success("Testimonies loaded", {
        description: `Loaded ${testimoniesData.length} testimonies`
      })
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to load testimonies", {
        description: "Please try again later"
      })
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchData()
    }
  }, [authLoading, user])

  // Logout
  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...")
    const result = await logout()
    toast.dismiss(loadingToast)
    if (result.success) {
      toast.success("Logged out successfully")
      router.push('/admin/login')
    } else {
      toast.error("Logout failed", {
        description: result.error || "An error occurred"
      })
    }
  }

  // Refresh
  const handleRefresh = () => {
    fetchData()
  }

  const filteredTestimonies = testimonies.filter((testimony) => {
    const matchesSearch =
      testimony.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimony.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimony.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || testimony.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Approve
  const handleApprove = (testimony: Testimony) => {
    setConfirmModal({
      isOpen: true,
      title: "Approve Testimony",
      message: `Are you sure you want to approve "${testimony.title}" by ${testimony.name}?`,
      confirmColor: 'green',
      onConfirm: async () => {
        const loadingToast = toast.loading("Approving...")
        try {
          const result = await updateTestimonyStatus(testimony.id, { status: 'approved' })
          if (result.success) {
            toast.dismiss(loadingToast)
            toast.success("Testimony approved")
            fetchData()
          } else {
            throw new Error(result.error)
          }
        } catch {
          toast.dismiss(loadingToast)
          toast.error("Failed to approve")
        }
      }
    })
  }

  // Reject
  const handleReject = (testimony: Testimony) => {
    setConfirmModal({
      isOpen: true,
      title: "Reject Testimony",
      message: `Are you sure you want to reject "${testimony.title}" by ${testimony.name}?`,
      confirmColor: 'red',
      onConfirm: async () => {
        const loadingToast = toast.loading("Rejecting...")
        try {
          const result = await updateTestimonyStatus(testimony.id, { status: 'rejected' })
          if (result.success) {
            toast.dismiss(loadingToast)
            toast.success("Testimony rejected")
            fetchData()
          } else {
            throw new Error(result.error)
          }
        } catch {
          toast.dismiss(loadingToast)
          toast.error("Failed to reject")
        }
      }
    })
  }

  // Delete
  const handleDelete = (testimony: Testimony) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Testimony",
      message: `Are you sure you want to permanently delete "${testimony.title}" by ${testimony.name}? This cannot be undone.`,
      confirmColor: 'red',
      onConfirm: async () => {
        const loadingToast = toast.loading("Deleting...")
        try {
          const result = await deleteTestimony(testimony.id)
          if (result.success) {
            toast.dismiss(loadingToast)
            toast.success("Testimony deleted")
            fetchData()
          } else {
            throw new Error(result.error)
          }
        } catch {
          toast.dismiss(loadingToast)
          toast.error("Failed to delete")
        }
      }
    })
  }

  if (authLoading) {
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
            <RefreshCw className="w-16 h-16 animate-spin" />
            <div>
              <p className="text-2xl font-black mb-2 text-center">Loading Testimonies</p>
              <div className="w-12 h-1 bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
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
            user={user!} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
          />
          
          <main className="lg:pl-64">
            <Header 
              onMenuClick={() => setSidebarOpen(true)} 
              user={user!}
              onLogout={handleLogout}
            />

            <div className="p-6 lg:p-8">
              {/* Page Header */}
              <div className="mb-10">
                <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Admin</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Testimonies<br />
                  <span className="italic font-light">Management</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Review, approve, and manage testimonies shared by church members.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black">
                  <div className="text-center">
                    <p className="text-4xl font-black text-gray-900">{stats.total}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-gray-600 mt-2">Total Testimonies</p>
                  </div>
                </div>
                <div className="bg-yellow-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-yellow-300">
                  <div className="text-center">
                    <p className="text-4xl font-black text-yellow-800">{stats.pending}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-yellow-700 mt-2">Pending</p>
                  </div>
                </div>
                <div className="bg-green-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-green-300">
                  <div className="text-center">
                    <p className="text-4xl font-black text-green-800">{stats.approved}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-green-700 mt-2">Approved</p>
                  </div>
                </div>
                <div className="bg-red-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-red-300">
                  <div className="text-center">
                    <p className="text-4xl font-black text-red-800">{stats.rejected}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-red-700 mt-2">Rejected</p>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search testimonies by title, name, or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 1.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em",
                      }}
                    >
                      <option value="all" className="text-gray-900">All Status</option>
                      <option value="pending" className="text-gray-900">Pending</option>
                      <option value="approved" className="text-gray-900">Approved</option>
                      <option value="rejected" className="text-gray-900">Rejected</option>
                    </select>
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="w-full lg:w-auto py-5 px-10 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 border-4 border-black hover:border-gray-800 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-black flex flex-col items-center gap-6">
                    <RefreshCw className="w-16 h-16 animate-spin" />
                    <div>
                      <p className="text-2xl font-black mb-2 text-center">Loading Testimonies</p>
                      <div className="w-12 h-1 bg-black mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonies List */}
              {!loading && (
                <div className="space-y-6">
                  {filteredTestimonies.map((testimony) => (
                    <div key={testimony.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative group hover:-translate-y-1 transition-transform duration-300">
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                      
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-black text-gray-900">{testimony.title}</h3>
                                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                    <span className="font-bold">{testimony.name}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>{formatDate(testimony.submittedAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className={`px-4 py-2 rounded-xl font-bold border-4 ${
                                testimony.status === "approved"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : testimony.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                              }`}>
                                {testimony.status.charAt(0).toUpperCase() + testimony.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed line-clamp-2">
                            {testimony.message}
                          </p>

                          {testimony.approvedAt && (
                            <p className="text-gray-600 text-sm font-medium">
                              Approved on {formatDate(testimony.approvedAt)}
                            </p>
                          )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex flex-col gap-3">
                          {testimony.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(testimony)}
                                className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider transition-all border-4 border-green-600 hover:border-green-700"
                              >
                                <Check className="w-5 h-5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(testimony)}
                                className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-all border-4 border-red-600 hover:border-red-700"
                              >
                                <X className="w-5 h-5" />
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => setSelectedTestimony(testimony)}
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-4 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-all"
                          >
                            <Eye className="w-5 h-5" />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(testimony)}
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-4 border-red-600 hover:bg-red-600 hover:text-white font-bold uppercase tracking-wider transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredTestimonies.length === 0 && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border-4 border-black text-center">
                  <div className="inline-block border-4 border-black p-8 mb-6">
                    <Search className="w-16 h-16 text-black" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-black">No testimonies found</h3>
                  <p className="text-gray-700 text-lg max-w-md mx-auto">
                    {searchTerm 
                      ? "No testimonies match your search criteria." 
                      : "No testimonies have been submitted yet."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-6 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* View Modal */}
      {selectedTestimony && (
        <TestimonyViewModal 
          testimony={selectedTestimony}
          isOpen={true}
          onClose={() => setSelectedTestimony(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmColor={confirmModal.confirmColor}
        />
      )}
    </>
  )
}