/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Loader2,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Clock,
  Mic2,
} from "lucide-react";
import { apiRequest } from "@/lib/api/client";

interface Sermon {
  id: number;
  title: string;
  pastor: string;
  service: string;
  date: string;
  youtubeId: string;
  duration?: string;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SermonsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ count: number; data: Sermon[] }>("/api/admin/sermons");

      if (res.success && Array.isArray(res.data)) {
        setSermons(res.data);
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to load sermons",
          variant: "destructive",
        });
        setSermons([]);
      }
    } catch (err) {
      console.error("Failed to fetch sermons:", err);
      toast({
        title: "Network Error",
        description: "Could not connect to server",
        variant: "destructive",
      });
      setSermons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSermons();
  }, [user]);

  const togglePublish = async (id: number, current: boolean) => {
    try {
      const res = await apiRequest(`/api/admin/sermons/${id}`, "PUT", {
        published: !current,
      });
      if (res.success) {
        setSermons((prev) =>
          prev.map((s) => (s.id === id ? { ...s, published: !current } : s))
        );
        toast({
          title: "Success",
          description: `Sermon ${!current ? "published" : "unpublished"} successfully`,
        });
      }
    } catch {
      toast({
        title: "Failed",
        description: "Could not update publish status",
        variant: "destructive",
      });
    }
  };

  const deleteSermon = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sermon permanently?")) return;

    try {
      const res = await apiRequest(`/api/admin/sermons/${id}`, "DELETE");
      if (res.success) {
        setSermons((prev) => prev.filter((s) => s.id !== id));
        toast({
          title: "Deleted",
          description: "Sermon removed permanently",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Failed",
        description: "Could not delete sermon",
        variant: "destructive",
      });
    }
  };

  const filteredSermons = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
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
              <p className="text-2xl font-black mb-2 text-center">Loading Sermons</p>
              <div className="w-12 h-1 bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
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
          onLogout={logout}
        />

        <div className="lg:pl-64">
          <Header user={user} onMenuClick={() => setSidebarOpen(true)} onLogout={logout} />

          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-10">
                <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Admin</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Sermons<br />
                  <span className="italic font-light">Management</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Manage, publish, and organize all church sermons and teachings in one place.
                </p>
              </div>

              {/* Search + Add Button */}
              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search sermons by title, pastor, or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div>
                  <Link href="/admin/sermons/new">
                    <button className="w-full lg:w-auto py-5 px-10 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 border-4 border-black hover:border-gray-800">
                      <Plus className="w-6 h-6" />
                      Add Sermon
                    </button>
                  </Link>
                </div>
              </div>

              {/* Sermons Table */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-4 border-black">
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Title</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Pastor</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Service</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Date</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Status</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSermons.map((sermon) => (
                        <tr
                          key={sermon.id}
                          className="border-b-2 border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                <Mic2 className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-lg font-black text-gray-900">{sermon.title}</p>
                                {sermon.duration && (
                                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4" /> {sermon.duration}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-500" />
                              <span className="font-bold text-gray-900">{sermon.pastor}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="bg-black text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                              {sermon.service}
                            </span>
                          </td>
                          <td className="p-6 text-gray-900 font-medium">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              {new Date(sermon.date).toLocaleDateString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="p-6">
                            <button
                              onClick={() => togglePublish(sermon.id, sermon.published)}
                              className={`px-6 py-3 rounded-xl font-bold border-4 transition-all ${
                                sermon.published
                                  ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                              }`}
                            >
                              {sermon.published ? (
                                <span className="flex items-center gap-2">
                                  <Eye className="w-5 h-5" /> Published
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <EyeOff className="w-5 h-5" /> Draft
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <Link href={`/admin/sermons/${sermon.id}/edit`}>
                                <button className="px-6 py-3 border-4 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all">
                                  <Edit className="w-5 h-5" />
                                </button>
                              </Link>
                              {user.role === "superadmin" && (
                                <button
                                  onClick={() => deleteSermon(sermon.id)}
                                  className="px-6 py-3 border-4 border-red-600 hover:bg-red-600 hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredSermons.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="inline-block border-4 border-black p-8 mb-6">
                        <Search className="w-16 h-16 text-black" />
                      </div>
                      <h3 className="text-3xl font-black mb-4 text-black">No sermons found</h3>
                      <p className="text-gray-700 text-lg max-w-md mx-auto">
                        {searchTerm 
                          ? "No sermons match your search criteria." 
                          : "No sermons have been added yet."}
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
              </div>

              {/* Stats Summary */}
              <div className="mt-10 bg-black text-white rounded-2xl p-8 border-4 border-black">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-2xl font-black mb-2">Sermon Statistics</h3>
                    <div className="w-16 h-1 bg-white mb-4"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-black">{sermons.length}</p>
                      <p className="text-white/80 text-sm">Total Sermons</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black">{sermons.filter(s => s.published).length}</p>
                      <p className="text-white/80 text-sm">Published</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black">{sermons.filter(s => !s.published).length}</p>
                      <p className="text-white/80 text-sm">Drafts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black">
                        {sermons.length > 0 
                          ? new Set(sermons.map(s => s.pastor)).size 
                          : 0}
                      </p>
                      <p className="text-white/80 text-sm">Pastors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}