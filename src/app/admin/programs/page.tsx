"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Search,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  CalendarDays,
} from "lucide-react"
import { toast } from "sonner"
import { Header } from "@/components/admin/header"
import { Sidebar } from "@/components/admin/sidebar"
import { adminGetRegularPrograms, deleteRegularProgram } from "@/lib/api/regular-programs"
import { getCurrentUser, logout } from "@/lib/api/auth"
import type { RegularProgram } from "@/lib/types/regular-program"
import type { AdminUser } from "@/lib/types/admin"
import ProgramFormModal from "../../../components/admin/event/ProgramFormModal"

export default function AdminProgramsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [programs, setPrograms] = useState<RegularProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProgramForm, setShowProgramForm] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<RegularProgram | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser()
      if (result.success && result.user) {
        setUser(result.user)
      } else {
        toast.error("Session expired. Please log in again.")
        router.push("/admin/login")
      }
      setAuthLoading(false)
    }
    fetchUser()
  }, [router])

  // Fetch programs
  const fetchPrograms = async () => {
    const t = toast.loading("Loading programs...")
    try {
      setLoading(true)
      const response = await adminGetRegularPrograms()
      if (response.success && Array.isArray(response.data)) {
        setPrograms(response.data)
        toast.dismiss(t)
        toast.success(`Loaded ${response.data.length} program(s)`)
      } else {
        setPrograms([])
        toast.dismiss(t)
        toast.error("Failed to load programs")
      }
    } catch {
      setPrograms([])
      toast.dismiss(t)
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchPrograms()
    }
  }, [authLoading, user])

  // Logout handler (required for Header and Sidebar)
  const handleLogout = async () => {
    const t = toast.loading("Logging out...")
    const result = await logout()
    toast.dismiss(t)
    if (result.success) {
      toast.success("Logged out successfully")
      router.push("/admin/login")
    } else {
      toast.error("Logout failed")
    }
  }

  const handleDelete = async (id: number, title: string) => {
    setDeletingId(id)
    const t = toast.loading(`Deleting "${title}"...`)
    try {
      const response = await deleteRegularProgram(id)
      if (response.success) {
        setPrograms(prev => prev.filter(p => p.id !== id))
        toast.dismiss(t)
        toast.success("Program deleted successfully")
      } else {
        toast.dismiss(t)
        toast.error(response.error || "Failed to delete program")
      }
    } catch {
      toast.dismiss(t)
      toast.error("Network error")
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setShowProgramForm(false)
    setSelectedProgram(null)
    fetchPrograms()
  }

  const handleCreate = () => {
    setSelectedProgram(null)
    setShowProgramForm(true)
  }

  const handleEdit = (program: RegularProgram) => {
    setSelectedProgram(program)
    setShowProgramForm(true)
  }

  // Filtered programs
  const filteredPrograms = programs.filter(program =>
    searchTerm === "" ||
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <p className="text-2xl font-black mb-2 text-center">Loading Programs</p>
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
                  Regular<br />
                  <span className="italic font-light">Programs</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Manage recurring church programs and weekly activities.
                </p>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search programs by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={fetchPrograms}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 py-5 px-10 bg-white border-4 border-black rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    <span className="font-black uppercase tracking-wider text-sm">Refresh</span>
                  </button>
                  <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-3 py-5 px-10 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:border-gray-800"
                  >
                    <Plus className="w-6 h-6" />
                    Add Program
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-32">
                  <div className="text-white flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin" />
                    <div>
                      <p className="text-2xl font-black mb-2 text-center">Loading Programs</p>
                      <div className="w-12 h-1 bg-white mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Programs List */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPrograms.map((program) => (
                    <div key={program.id} className="group">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative hover:-translate-y-2 transition-all duration-300">
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                        
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                              <CalendarDays className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-gray-900">{program.title}</h3>
                              <span className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-1 inline-block">
                                {program.frequency}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {program.description && (
                          <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                            {program.description}
                          </p>
                        )}

                        {/* Program Details */}
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-black" />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{program.frequency}</p>
                            </div>
                          </div>
                          
                          {program.time && (
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-black" />
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{program.time}</p>
                              </div>
                            </div>
                          )}
                          
                          {program.location && (
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-black" />
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{program.location}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 border-t-4 border-gray-200 pt-6">
                          <button
                            onClick={() => handleEdit(program)}
                            className="flex-1 py-3 border-4 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all"
                          >
                            <Edit className="w-5 h-5 inline-block mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(program.id, program.title)}
                            disabled={deletingId === program.id}
                            className="flex-1 py-3 border-4 border-red-600 hover:bg-red-600 hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                          >
                            {deletingId === program.id ? (
                              <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                            ) : (
                              <Trash2 className="w-5 h-5 inline-block mr-2" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredPrograms.length === 0 && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border-4 border-black text-center">
                  <div className="inline-block border-4 border-black p-8 mb-6">
                    <CalendarDays className="w-16 h-16 text-black" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-black">
                    {programs.length === 0 ? "No regular programs yet" : "No programs found"}
                  </h3>
                  <p className="text-gray-700 text-lg max-w-md mx-auto mb-6">
                    {programs.length === 0
                      ? "Start by creating your first regular program for the church"
                      : "Try adjusting your search criteria"}
                  </p>
                  {programs.length === 0 && (
                    <button
                      onClick={handleCreate}
                      className="px-10 py-5 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:border-gray-800"
                    >
                      <Plus className="w-6 h-6 inline-block mr-3" />
                      Create First Program
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Program Form Modal */}
      {showProgramForm && user && (
        <ProgramFormModal
          program={selectedProgram}
          onClose={() => {
            setShowProgramForm(false)
            setSelectedProgram(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  )
}