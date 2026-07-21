"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { submitTestimony } from '@/lib/api/testimonies'
import type { SubmitTestimonyFormData } from '@/lib/types/testimonies'
import SubmitButton from '@/components/common/SubmitButton'

export function SubmitTestimonyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitTestimonyFormData>({
    defaultValues: {
      name: '',
      title: '',
      message: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (data: SubmitTestimonyFormData) => {
    setIsSubmitting(true)
    
    const loadingToast = toast.loading('Submitting your testimony...')

    try {
      const result = await submitTestimony(data)
      
      if (result.success) {
        toast.success('Testimony Submitted', {
          description: 'Your testimony will be reviewed before publishing.',
          duration: 6000,
        })
        reset()
      } else {
        toast.error('Submission Failed', {
          description: result.error || 'Failed to submit testimony. Please try again.',
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Unexpected Error', {
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
      toast.dismiss(loadingToast)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Clean Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Share Your Testimony
        </h2>
        <p className="text-gray-600">
          Your story can inspire others. Share how God has worked in your life.
        </p>
      </div>

      {/* Clean Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036]/20 focus:border-[#C80036] transition ${
                errors.name ? 'border-black-500' : 'border-gray-300'
              }`}
              placeholder="John Kolade"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036]/20 focus:border-[#C80036] transition"
              placeholder="john@example.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036]/20 focus:border-[#C80036] transition"
            placeholder="+234 800 000 0000"
            disabled={isSubmitting}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Testimony Title *
          </label>
          <input
            type="text"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' }
            })}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036]/20 focus:border-[#C80036] transition ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., God's Healing Power in My Life"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Your Testimony *
          </label>
          <textarea
            rows={6}
            {...register('message', { 
              required: 'Testimony is required',
              minLength: { value: 20, message: 'Testimony must be at least 20 characters' }
            })}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C80036]/20 focus:border-[#C80036] transition resize-none ${
              errors.message ? 'border-black-500' : 'border-gray-300'
            }`}
            placeholder="Share your story of faith, healing, or breakthrough..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Please share at least 20 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <div className="flex items-center gap-4">
            <SubmitButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting..."
              className="px-8 py-3"
            >
              Share Your Testimony
            </SubmitButton>
            
            <button
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Form
            </button>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            * Required fields. Your testimony will be reviewed before publishing.
          </p>
        </div>
      </form>
    </div>
  )
}