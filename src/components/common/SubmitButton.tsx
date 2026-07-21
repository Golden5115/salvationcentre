
import React, { ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary" | "danger"

interface SubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
  loadingText?: string
}

export default function SubmitButton({
  children,
  variant = "primary",
  isLoading = false,
  loadingText = "Submitting...",
  disabled,
  className = "",
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || isLoading

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base " +
    "transition-all duration-200 ease-out shadow-lg select-none " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "transform hover:-translate-y-0.5 hover:shadow-xl " +
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 " +
      "text-white focus-visible:ring-red-600",

    secondary:
      "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 " +
      "text-white focus-visible:ring-blue-600",

    danger:
      "bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 " +
      "text-white focus-visible:ring-red-700",
  }

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <span
          className="absolute left-4 inline-flex h-5 w-5 animate-spin rounded-full 
                     border-2 border-white/30 border-t-white"
          aria-hidden="true"
        />
      )}

      {/* Button Content */}
      <span
        className={`flex items-center gap-2 transition-opacity ${
          isLoading ? "opacity-80" : "opacity-100"
        }`}
      >
        {isLoading ? loadingText : children}
      </span>
    </button>
  )
}
