/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Plus,
  Filter,
  Download,
  ChevronDown,
  Users,
  UserPlus,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { getAttendanceRecords, deleteAttendance } from "@/lib/api";
import { getServiceTypes } from "@/lib/api/service-types";
import { getCurrentUser, logout } from "@/lib/api/auth";

import type { AttendanceRecord } from "@/lib/types/attendance";
import type { ServiceType } from "@/lib/types/service-type";
import type { AdminUser } from "@/lib/types/admin";

import AttendanceModal from "../../../components/admin/attendance/AttendanceModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { Header } from "../../../components/admin/header";
import { Sidebar } from "../../../components/admin/sidebar";

export default function AttendancePage() {
  const router = useRouter();

  // Auth
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState<string>("all");

  // Data
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        toast.error("Session expired", { description: "Please log in again" });
        router.push("/admin/login");
      }
      setAuthLoading(false);
    };
    fetchUser();
  }, [router]);

  // Fetch data
  const fetchData = async () => {
    const loadingToast = toast.loading("Loading attendance records...");
    try {
      setLoading(true);
      setError(null);

      const [attendanceData, serviceTypesData] = await Promise.all([
        getAttendanceRecords(),
        getServiceTypes(),
      ]);

      // Sort by date descending (newest first) and limit to top 20 records
      const sortedAttendance = attendanceData
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

      setAttendance(sortedAttendance);
      setServiceTypes(serviceTypesData);

      toast.dismiss(loadingToast);
      toast.success("Data loaded successfully", {
        description: `Loaded ${sortedAttendance.length} recent record(s)`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
      toast.dismiss(loadingToast);
      toast.error("Failed to load data", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  const handleLogout = async () => {
    toast.loading("Logging out...");
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } else {
      toast.error("Logout failed");
    }
  };

  // Handlers
  const handleAdd = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setRecordToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    const record = attendance.find((r) => r.id === recordToDelete);
    const recordDate = record ? new Date(record.date).toLocaleDateString() : "record";

    setDeletingId(recordToDelete);

    try {
      await deleteAttendance(recordToDelete);
      await fetchData();
      toast.success("Record deleted", {
        description: `Attendance for ${recordDate} removed`,
      });
      setIsDeleteConfirmOpen(false);
      setRecordToDelete(null);
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Could not delete record",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleModalSuccess = () => {
    fetchData();
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleExport = () => {
    try {
      const headers = [
        "Date",
        "Service Type",
        "Adults",
        "Children",
        "Total",
        "First Timers",
        "Visitors",
        "Members",
        "Notes",
        "Recorded By",
      ];
      const csvData = attendance.map((record) => [
        record.date,
        record.serviceType,
        record.adults,
        record.children,
        record.total,
        record.firstTimers,
        record.visitors,
        record.members,
        record.notes || "",
        record.recordedBy,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Export successful", {
        description: `${attendance.length} records exported`,
      });
    } catch (err) {
      toast.error("Export failed");
    }
  };

  // Filtered attendance
  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.date.includes(searchTerm) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = filterService === "all" || record.serviceType === filterService;

    return matchesSearch && matchesService;
  });

  const stats = {
    totalRecords: attendance.length,
    avgAttendance:
      attendance.length > 0
        ? Math.round(attendance.reduce((sum, r) => sum + r.total, 0) / attendance.length)
        : 0,
    totalFirstTimers: attendance.reduce((sum, r) => sum + r.firstTimers, 0),
    lastWeekAttendance: attendance[0]?.total || 0,
  };

  if (authLoading || !user) {
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
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-2xl font-black mb-2 text-center">Authenticating</p>
              <div className="w-12 h-1 bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
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
              <p className="text-2xl font-black mb-2 text-center">Loading Attendance</p>
              <div className="w-12 h-1 bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
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

          <div className="lg:ml-64 min-h-screen flex flex-col">
            <Header
              user={user}
              onMenuClick={() => setSidebarOpen(true)}
              onLogout={handleLogout}
            />

            <main className="flex-1 p-6 lg:p-8 space-y-8">
              {/* Page Header */}
              <div className="mb-10">
                <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Admin</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Attendance<br />
                  <span className="italic font-light">Management</span>
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Track and manage service attendance records for church services and events.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black">
                  <div className="text-center">
                    <p className="text-4xl font-black text-gray-900">{stats.totalRecords}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-gray-600 mt-2">Total Records</p>
                  </div>
                </div>
                <div className="bg-blue-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-blue-300">
                  <div className="text-center">
                    <p className="text-4xl font-black text-blue-800">{stats.avgAttendance}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-blue-700 mt-2">Avg Attendance</p>
                  </div>
                </div>
                <div className="bg-green-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-green-300">
                  <div className="text-center">
                    <p className="text-4xl font-black text-green-800">{stats.lastWeekAttendance}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-green-700 mt-2">Last Service</p>
                  </div>
                </div>
                <div className="bg-yellow-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-yellow-300">
                  <div className="text-center">
                    <p className="text-4xl font-black text-yellow-800">{stats.totalFirstTimers}</p>
                    <p className="text-sm font-black uppercase tracking-widest text-yellow-700 mt-2">First-Timers</p>
                  </div>
                </div>
              </div>

              {/* Search, Filters, and Actions */}
              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search by date, notes, or recorded by..."
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
                      value={filterService}
                      onChange={(e) => setFilterService(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium text-lg bg-white/95 backdrop-blur-sm appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 1.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em",
                      }}
                    >
                      <option value="all" className="text-gray-900">All Service Types</option>
                      {serviceTypes.map((type) => (
                        <option key={type.id} value={type.name} className="text-gray-900">
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {serviceTypes.length === 0 && (
                    <p className="mt-3 text-white/80 text-sm">No service types available</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <button
                  onClick={fetchData}
                  className="flex items-center justify-center gap-3 py-5 px-10 bg-white border-4 border-black rounded-xl hover:bg-gray-50 transition-all"
                >
                  <RefreshCw className="w-6 h-6" />
                  <span className="font-black uppercase tracking-wider text-lg">Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-3 py-5 px-10 bg-black text-white border-4 border-black rounded-xl hover:bg-gray-800 transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span className="font-black uppercase tracking-wider text-lg">Export CSV</span>
                </button>
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-3 py-5 px-10 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:border-gray-800"
                >
                  <Plus className="w-6 h-6" />
                  Add Record
                </button>
              </div>

              {/* Table */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-4 border-black">
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Date</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Service Type</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Adults</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Children</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Total</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">First-Timers</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Visitors</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Recorded By</th>
                        <th className="text-left p-6 text-sm font-black uppercase tracking-widest text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((record) => (
                        <tr key={record.id} className="border-b-2 border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="p-6 text-gray-900 font-medium">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-black text-white text-xs font-black uppercase tracking-widest">
                              {record.serviceType}
                            </span>
                          </td>
                          <td className="p-6 text-gray-900 font-bold text-lg">{record.adults}</td>
                          <td className="p-6 text-gray-900 font-bold text-lg">{record.children}</td>
                          <td className="p-6">
                            <span className="px-4 py-2 rounded-xl bg-black text-white font-bold text-lg">
                              {record.total}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <UserPlus className="w-5 h-5 text-yellow-600" />
                              <span className="font-bold text-yellow-800 text-lg">{record.firstTimers}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-blue-600" />
                              <span className="font-bold text-blue-800 text-lg">{record.visitors}</span>
                            </div>
                          </td>
                          <td className="p-6 text-gray-700 font-medium">{record.recordedBy}</td>
                          <td className="p-6">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(record)}
                                className="px-6 py-3 border-4 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                disabled={deletingId === record.id}
                                className="px-6 py-3 border-4 border-red-600 hover:bg-red-600 hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                              >
                                {deletingId === record.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredAttendance.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="inline-block border-4 border-black p-8 mb-6">
                        <Search className="w-16 h-16 text-black" />
                      </div>
                      <h3 className="text-3xl font-black mb-4 text-black">No attendance records found</h3>
                      <p className="text-gray-700 text-lg max-w-md mx-auto mb-6">
                        {searchTerm || filterService !== "all"
                          ? "No matching records found for your search criteria."
                          : "No attendance records have been added yet."}
                      </p>
                      {searchTerm || filterService !== "all" ? (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterService('all');
                          }}
                          className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all"
                        >
                          Clear Filters
                        </button>
                      ) : (
                        <button
                          onClick={handleAdd}
                          className="px-10 py-5 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:border-gray-800"
                        >
                          <Plus className="w-6 h-6 inline-block mr-3" />
                          Add First Record
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AttendanceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        record={selectedRecord}
        serviceTypes={serviceTypes}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setRecordToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Attendance Record"
        message="Are you sure you want to delete this attendance record? This action cannot be undone."
        confirmText={deletingId ? "Deleting..." : "Delete"}
        confirmColor="red"
        isProcessing={deletingId !== null}
      />
    </>
  );
}