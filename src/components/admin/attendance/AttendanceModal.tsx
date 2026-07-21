"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createAttendance, updateAttendance } from "@/lib/api";
import type {
  AttendanceRecord,
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from "@/lib/types/attendance";
import type { ServiceType } from "@/lib/types/service-type";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message?: string) => void;
  record: AttendanceRecord | null;
  serviceTypes: ServiceType[];
}

export default function AttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  record,
  serviceTypes,
}: AttendanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAttendanceDto>({
    date: new Date().toISOString().split("T")[0],
    serviceType: serviceTypes[0]?.name || "",
    adults: 0,
    children: 0,
    total: 0,
    firstTimers: 0,
    visitors: 0,
    members: 0,
    notes: "",
  });

  // Initialize form when modal opens or record/serviceTypes change
  useEffect(() => {
    if (!isOpen) return;

    if (record) {
      setFormData({
        date: record.date.split("T")[0],
        serviceType: record.serviceType,
        adults: record.adults,
        children: record.children,
        total: record.total,
        firstTimers: record.firstTimers,
        visitors: record.visitors,
        members: record.members,
        notes: record.notes || "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        date: today,
        serviceType: serviceTypes[0]?.name || "",
        adults: 0,
        children: 0,
        total: 0,
        firstTimers: 0,
        visitors: 0,
        members: 0,
        notes: "",
      });
    }
  }, [record, serviceTypes, isOpen]);

  // Auto-calculate total whenever adults or children change
  useEffect(() => {
    const total = formData.adults + formData.children;
    setFormData((prev) => ({ ...prev, total }));
  }, [formData.adults, formData.children]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      ["adults", "children", "firstTimers", "visitors", "members"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(
      record ? "Updating attendance record..." : "Creating attendance record..."
    );

    try {
      // Validation
      if (!formData.date) {
        throw new Error("Date is required");
      }
      if (!formData.serviceType) {
        throw new Error("Please select a service type");
      }
      if (
        formData.adults < 0 ||
        formData.children < 0 ||
        formData.firstTimers < 0 ||
        formData.visitors < 0 ||
        formData.members < 0
      ) {
        throw new Error("All counts must be non-negative");
      }

      if (record) {
        const updateData: UpdateAttendanceDto = { ...formData };
        await updateAttendance(record.id, updateData);
      } else {
        await createAttendance(formData);
      }

      // Success
      toast.success(
        record
          ? "Attendance record updated successfully!"
          : "New attendance record created!",
        {
          description: `Saved record for ${new Date(formData.date).toLocaleDateString()}`,
          duration: 4000,
        }
      );

      onSuccess(
        record
          ? "Attendance record updated successfully!"
          : "Attendance record added successfully!"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save record";

      toast.error("Save failed", {
        description: errorMessage,
        duration: 5000,
      });

      console.error("Error saving attendance:", err);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const handleClose = () => {
    if (loading) return;
    toast.info("Form closed", {
      description: "No changes were saved",
      duration: 2000,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-2xl font-bold font-teko">
            {record ? "Edit Attendance Record" : "Add New Record"}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Service Type <span className="text-red-400">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
              >
                <option value="" className="bg-gray-800 text-white">Select service type...</option>
                {serviceTypes.map((type) => (
                  <option key={type.id} value={type.name} className="bg-gray-800 text-white py-2">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Adults */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Adults
              </label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* Children */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Children
              </label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* First Timers */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                First Timers
              </label>
              <input
                type="number"
                name="firstTimers"
                value={formData.firstTimers}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* Visitors */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Visitors
              </label>
              <input
                type="number"
                name="visitors"
                value={formData.visitors}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* Members */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Members
              </label>
              <input
                type="number"
                name="members"
                value={formData.members}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* Total (Read-only) */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Total (Auto)
              </label>
              <input
                type="number"
                value={formData.total}
                readOnly
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this service (e.g., special event, weather impact, etc.)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
            />
          </div>

          {/* Actions */}
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
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading
                ? "Saving..."
                : record
                ? "Update Record"
                : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}