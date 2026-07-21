
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  Archive, 
  RefreshCw,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import type { PrayerRequest } from '@/lib/types/prayer-request'
import { 
  adminGetPrayerRequests, 
  updatePrayerRequest, 
  deletePrayerRequest 
} from '@/lib/api/prayer-requests'
import { getCurrentUser, logout } from '@/lib/api/auth'
import type { AdminUser } from '@/lib/types/admin'

import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import ConfirmModal from '@/components/common/ConfirmModal'
import PrayerRequestViewModal from '@/components/common/PrayerRequestViewModal'

export default function PrayerRequestsPage() {
  const router = useRouter()

  // Auth state
  const [user, setUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Page state
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // View modal state
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null)

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => Promise<void>
    confirmColor: 'red' | 'blue' | 'green'
  } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Derived stats
  const stats = {
    total: prayerRequests.length,
    pending: prayerRequests.filter(r => r.status === 'pending').length,
    prayed: prayerRequests.filter(r => r.status === 'prayed').length,
    archived: prayerRequests.filter(r => r.status === 'archived').length,
  }

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

  // Fetch prayer requests
  const fetchData = async () => {
    const loadingToast = toast.loading("Loading prayer requests...")
    try {
      setLoading(true)
      const response = await adminGetPrayerRequests()
      
      if (response.success && response.data) {
        setPrayerRequests(response.data)
        toast.dismiss(loadingToast)
        toast.success("Prayer requests loaded", {
          description: `Loaded ${response.data.length} requests`
        })
      } else {
        throw new Error(response.error || "Failed to load data")
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to load prayer requests", {
        description: "Please try again later"
      })
      console.error('Failed to fetch prayer requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchData()
    }
  }, [authLoading, user])

  // Logout handler
  const handleLogout = async () => {
    const t = toast.loading("Logging out...")
    const result = await logout()
    toast.dismiss(t)
    if (result.success) {
      toast.success("Logged out successfully")
      router.push('/admin/login')
    } else {
      toast.error("Logout failed")
    }
  }

  // Refresh handler
  const handleRefresh = () => {
    fetchData()
  }

  // Filtered requests
  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.email && request.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.request.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Mark as Prayed
  const handleMarkAsPrayed = (request: PrayerRequest) => {
    setConfirmModal({
      isOpen: true,
      title: "Mark as Prayed",
      message: `Mark the prayer request from ${request.name} as prayed?`,
      confirmColor: 'green',
      onConfirm: async () => {
        const loadingToast = toast.loading("Updating...")
        try {
          const result = await updatePrayerRequest(request.id, { status: 'prayed' })
          if (result.success) {
            toast.dismiss(loadingToast)
            toast.success("Marked as prayed")
            fetchData()
          } else {
            throw new Error(result.error)
          }
        } catch {
          toast.dismiss(loadingToast)
          toast.error("Failed to update status")
        }
      }
    })
  }

  // Archive
  const handleArchive = (request: PrayerRequest) => {
    setConfirmModal({
      isOpen: true,
      title: "Archive Request",
      message: `Archive the prayer request from ${request.name}?`,
      confirmColor: 'red',
      onConfirm: async () => {
        const loadingToast = toast.loading("Archiving...")
        try {
          const result = await updatePrayerRequest(request.id, { status: 'archived' })
          if (result.success) {
            toast.dismiss(loadingToast)
            toast.success("Request archived")
            fetchData()
          } else {
            throw new Error(result.error)
          }
        } catch {
          toast.dismiss(loadingToast)
          toast.error("Failed to archive")
        }
      }
    })
  }

  // Delete
  const handleDelete = (request: PrayerRequest) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Prayer Request",
      message: `Permanently delete the prayer request from ${request.name}? This cannot be undone.`,
      confirmColor: 'red',
      onConfirm: async () => {
        const loadingToast = toast.loading("Deleting...")
        try {
          const result = await deletePrayerRequest(request.id)
          if (result.success) {
            toast.dismiss(loadingToast)
            toast.success("Request deleted")
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
              {/* Page Header - Updated to match Events page style */}
              <div className="mb-10">
                <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Admin</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Prayer<br />
                  <span className="italic font-light">Requests</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Manage and respond to prayer requests submitted by church members and visitors.
                </p>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or request content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 py-5 px-10 bg-white border-4 border-black rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    <span className="font-black uppercase tracking-wider text-sm">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Stats - Updated styling */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">Total Requests</p>
                  <p className="text-4xl font-black text-black">{stats.total}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-yellow-600 text-sm font-bold uppercase tracking-wider mb-2">Pending</p>
                  <p className="text-4xl font-black text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-2">Prayed</p>
                  <p className="text-4xl font-black text-green-600">{stats.prayed}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-xl">
                  <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-2">Archived</p>
                  <p className="text-4xl font-black text-red-600">{stats.archived}</p>
                </div>
              </div>

              {/* Filter - Updated styling */}
              <div className="relative mb-10">
                <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-96 pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="prayed">Prayed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-32">
                  <div className="text-black flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin" />
                    <div>
                      <p className="text-2xl font-black mb-2 text-center">Loading Prayer Requests</p>
                      <div className="w-12 h-1 bg-black mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prayer Requests List */}
              {!loading && (
                <div className="space-y-6">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="group">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative hover:-translate-y-2 transition-all duration-300">
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                        
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Left Side - Request Info */}
                          <div className="flex-1 space-y-6">
                            {/* Header with name and status */}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <h3 className="text-2xl font-black text-gray-900">{request.name}</h3>
                                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border-2 ${
                                    request.status === 'pending' 
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-800'
                                      : request.status === 'prayed'
                                      ? 'bg-green-100 text-green-800 border-green-800'
                                      : 'bg-red-100 text-red-800 border-red-800'
                                  }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                                  {request.email && <span>{request.email}</span>}
                                  {request.email && <span className="text-gray-400">•</span>}
                                  <span className="font-medium">Submitted {formatDate(request.submittedAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Request Content */}
                            <div className="space-y-4">
                              <div>
                                <p className="font-bold text-gray-900 text-sm mb-1">Prayer Request</p>
                                <p className="text-gray-700 leading-relaxed">
                                  {request.request}
                                </p>
                              </div>

                              {request.status !== 'pending' && (
                                <div className="text-sm">
                                  <p className="font-bold text-gray-900 mb-1">
                                    {request.status === 'prayed' ? 'Prayed for' : 'Archived'} 
                                  </p>
                                  <p className="text-gray-600">
                                    {formatDate(request.updatedAt)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Side - Actions */}
                          <div className="lg:w-80 space-y-4">
                            {/* Action Buttons */}
                            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
                              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-4">Actions</p>
                              <div className="space-y-3">
                                {request.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleMarkAsPrayed(request)}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-green-600 hover:border-green-700"
                                    >
                                      <Check className="w-5 h-5" />
                                      Mark as Prayed
                                    </button>
                                    <button
                                      onClick={() => handleArchive(request)}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-red-600 hover:border-red-700"
                                    >
                                      <Archive className="w-5 h-5" />
                                      Archive
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => setSelectedRequest(request)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-blue-600 hover:border-blue-700"
                                >
                                  <Eye className="w-5 h-5" />
                                  View Details
                                </button>
                                <div className="flex gap-2">
                                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-yellow-600 hover:border-yellow-700 text-sm">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(request)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-all border-2 border-red-600 hover:border-red-700 text-sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredRequests.length === 0 && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border-4 border-black text-center">
                  <div className="inline-block border-4 border-black p-8 mb-6">
                    <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-black">
                    {searchTerm || filterStatus !== "all" 
                      ? "No prayer requests match your search"
                      : "No prayer requests yet"}
                  </h3>
                  <p className="text-gray-700 text-lg max-w-md mx-auto mb-6">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Prayer requests will appear here when submitted"}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* View Modal */}
      {selectedRequest && (
        <PrayerRequestViewModal
          request={selectedRequest}
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
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