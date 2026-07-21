/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>; 
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "red" | "blue" | "green";
  isProcessing?: boolean; 
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "blue",
  isProcessing = false, 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colorClasses = {
    red: "from-red-700 to-red-800 hover:from-red-600 hover:to-red-700",
    blue: "from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-700 to-green-800 hover:from-green-600 hover:to-green-700",
  };

  const handleConfirm = async () => {
    if (isProcessing) return; 

    try {
      await onConfirm();
      onClose(); 
    } catch (err) {
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-bold font-teko">{title}</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-white/80 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-gray-900/50">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`relative px-7 py-2.5 rounded-xl bg-linear-to-r ${colorClasses[confirmColor]} text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3`}
          >
            {isProcessing && (
              <svg
                className="animate-spin h-4 w-4 text-white"
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
            {isProcessing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}