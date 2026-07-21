'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Send, User, Phone, Mail, MapPin, Briefcase, Calendar, Church, CheckSquare } from 'lucide-react'
import { toast } from 'sonner' 

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Invalid email address'), // Required for this form
  gender: z.string().min(1, 'Please select your gender'),
  dob: z.string().optional().or(z.literal('')),
  address: z.string().min(5, 'Home address is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  organization: z.string().min(2, 'Church or Organization is required'),
  sessions: z.string().optional(),
  specialNeeds: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ProgramRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      gender: '',
      dob: '',
      address: '',
      occupation: '',
      organization: '',
      sessions: '',
      specialNeeds: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      /*
        ====================================================================
        🚀 API INTEGRATION FLOW 🚀
        ====================================================================
        This is where the form data is sent to your backend.
      */
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/program-registration` 
        : '/api/program-registration' 

      // Simulate a network delay for the UI demo if the endpoint isn't ready
      if (!process.env.NEXT_PUBLIC_API_URL) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('✅ Demo Payload that would be sent to API:', data)
      } else {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to submit registration')
        }

        const result = await response.json()
        console.log('✅ API Response Data:', result)
      }

      toast.success('Registration Successful!', {
        description: 'Your seat has been reserved. We look forward to seeing you!',
      })
      reset()
    } catch (error) {
      console.error('❌ API Submission Error:', error)
      toast.error('Registration Failed', {
        description: 'There was an error processing your registration. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Common input styling for the premium light theme
  const inputClassName = "w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#111] px-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDB771]/50 focus:border-[#DDB771] transition-all placeholder:text-gray-400 font-light"
  const labelClassName = "block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-[11px]"

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DDB771]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DDB771]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-[2px] bg-[#DDB771] mb-6" 
          />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold text-[#0a0a0c] mb-6"
            style={{ fontFamily: 'var(--font-lora), serif' }}
          >
            Special Program <span className="text-[#DDB771]">Registration</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 font-light"
          >
            Secure your seat for our upcoming life-transforming sessions. Fill out the details below to complete your registration.
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 p-8 md:p-12"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Grid 1: Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClassName}>Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('fullName')} className={`${inputClassName} pl-12`} placeholder="John Doe" />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-2">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('phoneNumber')} className={`${inputClassName} pl-12`} placeholder="+234 800 000 0000" />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-2">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('email')} className={`${inputClassName} pl-12`} placeholder="john@example.com" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Date of Birth (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input type="date" {...register('dob')} className={`${inputClassName} pl-12`} />
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-2">{errors.dob.message}</p>}
              </div>
            </div>

            {/* Grid 2: Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-100">
              <div>
                <label className={labelClassName}>Gender *</label>
                <select {...register('gender')} className={inputClassName}>
                  <option value="">Select Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-2">{errors.gender.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Occupation *</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('occupation')} className={`${inputClassName} pl-12`} placeholder="e.g. Engineer, Student" />
                </div>
                {errors.occupation && <p className="text-red-500 text-xs mt-2">{errors.occupation.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Church/Organization *</label>
                <div className="relative">
                  <Church className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('organization')} className={`${inputClassName} pl-12`} placeholder="e.g. RCCG Salvation Centre" />
                </div>
                {errors.organization && <p className="text-red-500 text-xs mt-2">{errors.organization.message}</p>}
              </div>
            </div>

            {/* Full width inputs */}
            <div className="space-y-8 pt-6 border-t border-gray-100">
              <div>
                <label className={labelClassName}>Home Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('address')} className={`${inputClassName} pl-12`} placeholder="Enter your full home address" />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-2">{errors.address.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Which session(s) will you be attending? (Optional)</label>
                <div className="relative">
                  <CheckSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <input {...register('sessions')} className={`${inputClassName} pl-12`} placeholder="e.g. Morning Session, Evening Session, Both" />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Any special needs or requests? (Optional)</label>
                <textarea 
                  {...register('specialNeeds')} 
                  className={`${inputClassName} min-h-[120px] resize-y`} 
                  placeholder="Let us know if you require any specific assistance or accommodation..." 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-[#DDB771] text-[#111] font-semibold text-[15px] tracking-wide rounded-md hover:bg-[#cda258] transition-all duration-300 shadow-[0_0_20px_rgba(221,183,113,0.3)] hover:shadow-[0_0_30px_rgba(221,183,113,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" strokeWidth={1.5} />
                    Complete Registration
                  </>
                )}
              </button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </section>
  )
}
