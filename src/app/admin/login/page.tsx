'use client'

import Link from 'next/link'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { loginWithIdToken } from '@/lib/api/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      
      const idToken = await userCredential.user.getIdToken()

      const response = await loginWithIdToken(idToken)

      if (response.success && response.user) {
        setSuccess('Login successful! Redirecting...')
        
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1500)
      } else {
        setError(response.error || 'Login failed. Please try again.')
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      const errorCode = error?.code
      
      switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          setError('Invalid email or password')
          break
        case 'auth/user-not-found':
          setError('No account found with this email')
          break
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.')
          break
        default:
          setError(error?.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!formData.email) {
      setError('Please enter your email address first')
      return
    }

    try {
      await sendPasswordResetEmail(auth, formData.email)
      setSuccess('Password reset email sent! Check your inbox.')
      setError('')
    } catch (err: unknown) {
      const error = err as { code?: string }
      if (error?.code === 'auth/user-not-found') {
        setError('No account found with this email address')
      } else {
        setError('Failed to send reset email. Please try again.')
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-white font-roboto flex items-center justify-center p-4 relative overflow-hidden">
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
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/70 to-black/60 z-10" />
      </div>

      {/* Decorative corner elements - Matching Connect page */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-white opacity-20 z-20"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-white opacity-20 z-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-white opacity-20 z-20"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-white opacity-20 z-20"></div>

      <div className="w-full max-w-md relative z-30">
        {/* Back to Home Link */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white font-bold hover:opacity-70 transition-opacity group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Main Website
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-white/30 relative">
          {/* Decorative corner accents - Matching Connect page forms */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-white"></div>
          <div className="absolute top-0 right-0 w-8 h-8 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-white"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-white"></div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block border-2 border-black/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="text-black font-bold uppercase tracking-widest text-xs">Admin</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
              Admin<br />
              <span className="italic font-light">Portal</span>
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-lg text-black/80 max-w-md mx-auto font-light">
              Secure access to church management dashboard
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-600 font-medium text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-green-600 font-medium text-sm">{success}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all font-medium disabled:opacity-70 bg-white/80 backdrop-blur-sm"
                placeholder="admin@example.org"
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all font-medium disabled:opacity-70 bg-white/80 backdrop-blur-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-2 focus:ring-black/50 bg-white/80 backdrop-blur-sm"
                  disabled={loading}
                />
                <span className="text-gray-700 font-medium">Remember this device</span>
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="text-black font-bold hover:underline text-sm"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 border-2 border-black hover:border-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  SIGNING IN...
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6" />
                  SIGN IN
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-10 pt-8 border-t-2 border-gray-200">
            <div className="flex items-start gap-4 bg-gray-50/80 backdrop-blur-sm rounded-xl p-6">
              <Lock className="w-6 h-6 text-black shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-black mb-2">Security Notice</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  This portal is secured and monitored. Access is restricted to authorized personnel only. 
                  All activities are logged for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-white font-medium text-sm">
            © {new Date().getFullYear()} RCCG Salvation Centre. All rights reserved.
          </p>
          <p className="text-white/70 text-xs mt-2">
            For assistance, contact system administrator
          </p>
        </div>
      </div>
    </div>
  )
}