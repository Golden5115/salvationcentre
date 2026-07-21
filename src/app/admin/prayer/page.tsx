
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Calendar,
  Mail,
  User,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

import { Header } from "@/components/admin/header"
import { Sidebar } from "@/components/admin/sidebar"
import { adminGetPrayerRequests, deletePrayerRequest } from "@/lib/api"
import { getCurrentUser, logout } from "@/lib/api/auth"

import type { PrayerRequest } from "@/lib/types/prayer-request"
import type { AdminUser } from "@/lib/types/admin"

import ConfirmModal from "@/components/common/ConfirmModal"

export default function PrayerRequestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<PrayerRequest | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser()
      if (result.success && result.user) {
        setUser(result.user)
      } else {
        toast.error("Session expired")
        router.push("/admin/login")
      }
      setAuthLoading(false)
    }
    fetchUser()
  }, [router])

  const fetchRequests = async () => {
    const t = toast.loading("Loading prayer requests...")
    try {
      setLoading(true)
      const res = await adminGetPrayerRequests()
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data)
        toast.dismiss(t)
        toast.success(`Loaded ${res.data.length} request(s)`)
      } else {
        setRequests([])
        toast.dismiss(t)
        toast.error("Failed to load requests")
      }
    } catch {
      setRequests([])
      toast.dismiss(t)
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) fetchRequests()
  }, [authLoading, user])

  const handleDelete = (request: PrayerRequest) => {
    setRequestToDelete(request)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return

    setDeletingId(requestToDelete.id)
    const t = toast.loading("Deleting request...")
    try {
      const res = await deletePrayerRequest(requestToDelete.id)
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== requestToDelete.id))
        toast.success("Prayer request deleted")
      } else {
        toast.error("Failed to delete")
      }
    } finally {
      setDeletingId(null)
      setIsDeleteConfirmOpen(false)
      setRequestToDelete(null)
      toast.dismiss(t)
    }
  }

  const filteredRequests = requests.filter(r =>
    searchTerm === "" ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.request.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0C1844]">
        <Loader2 className="w-8 h-8 text-[#C80036] animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen bg-[#0C1844] text-white overflow-hidden">
        {user && (
          <Sidebar
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={logout}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {user && (
            <Header
              user={user}
              onMenuClick={() => setSidebarOpen(true)}
              onLogout={logout}
            />
          )}

          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Prayer Requests</h1>
                <p className="text-white/60 mt-1">View and manage submitted prayer requests</p>
              </div>
              <button
                onClick={fetchRequests}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by name, email, or request..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C80036] placeholder-white/40"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#C80036] animate-spin" />
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-[#C80036]/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                          <User className="w-5 h-5 text-[#C80036]" />
                          {request.name}
                        </h3>
                        <p className="text-white/70 flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4" />
                          {request.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60 flex items-center justify-end gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          request.status === 'prayed' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-5 mb-4">
                      <p className="text-white/90 leading-relaxed">{request.request}</p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button className="px-5 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl text-blue-400 transition-all">
                        Mark as Prayed
                      </button>
                      <button
                        onClick={() => handleDelete(request)}
                        disabled={deletingId === request.id}
                        className="px-5 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-xl text-red-400 transition-all disabled:opacity-50"
                      >
                        {deletingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin inline" />
                        ) : (
                          <Trash2 className="w-4 h-4 inline" />
                        )}
                        {' '}Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Mail className="w-20 h-20 text-white/20 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-white/80 mb-2">No prayer requests yet</h3>
                <p className="text-white/50">When visitors submit prayer requests, they will appear here.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false)
          setRequestToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Prayer Request"
        message={`Are you sure you want to delete the prayer request from "${requestToDelete?.name}"? This cannot be undone.`}
        confirmText={deletingId ? "Deleting..." : "Delete"}
        confirmColor="red"
        isProcessing={!!deletingId}
      />
    </>
  )
}