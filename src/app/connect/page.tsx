"use client"

import { Send } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { createPrayerRequest } from '@/lib/api/prayer-requests'

const serviceTimes = [
  { title: 'Bible Study', time: 'Tuesdays 6:30PM - 8:00PM' },
  { title: 'Online Vigil', time: 'Wednesdays 11PM - 1AM' },
  { title: 'Faith Clinic', time: 'Thursdays 6:30PM - 8:00PM' },
  { title: 'Beginning with Jesus', time: '1st of Every Month 6AM - 7AM' },
  { title: 'Sunday Worship Service', time: '9:00 AM – 12:30 PM' },
]

export default function ConnectPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      request: formData.get('request') as string,
    }

    const response = await createPrayerRequest(payload)

    if (response.success) {
      toast.success('Thank you! Your prayer request has been submitted.', {
        description: 'Our prayer team will intercede on your behalf.',
      })
      e.currentTarget.reset()
    } else {
      toast.error('Failed to submit prayer request', {
        description: response.error || 'Please try again later.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Matching About page style */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC_4859-SfMaCwVg5FESuinvG18QmKpkZeNouW.jpg"
            alt="RCCG Salvation Centre"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/90 to-black/95 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-30">
          <div className="text-center">
            <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="text-white font-bold uppercase tracking-widest text-xs">Connect</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Connect<br />
              <span className="italic font-light">With Us</span>
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto font-light">
              We are a family of believers committed to knowing Jesus and making Him known. 
              Whether you&apos;re new or returning, we&apos;d love to connect with you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Map Section */}
      <div className="py-20 md:py-32 relative overflow-hidden bg-linear-to-b from-white via-[#F9FAFB] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Contact Information */}
            <div className="space-y-10">
              <div>
                <div className="w-20 h-1 bg-black mb-6"></div>
                <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
                  Get In<br />
                  <span className="italic">Touch</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-black pl-6">
                  <h3 className="font-black text-sm uppercase tracking-widest mb-3 text-gray-600">Location</h3>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-black">
                      10, Oba Akinjobi Way
                    </p>
                    <p className="text-lg text-gray-700">GRA, Ikeja</p>
                    <p className="text-lg text-gray-700">Lagos State, Nigeria</p>
                  </div>
                </div>

                <div className="border-l-4 border-black pl-6">
                  <h3 className="font-black text-sm uppercase tracking-widest mb-3 text-gray-600">Contact</h3>
                  <div className="space-y-4">
                    <a 
                      href="tel:+2341234567890" 
                      className="text-xl font-bold hover:opacity-70 transition-opacity block text-black"
                    >
                      +234 123 456 7890
                    </a>
                    <a 
                      href="mailto:rccgsalvationcentre01@gmail.com" 
                      className="text-xl font-bold hover:opacity-70 transition-opacity block text-black"
                    >
                      rccgsalvationcentre01@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="relative">
              <div className="absolute -inset-4 border-4 border-black"></div>
              <div className="relative overflow-hidden bg-gray-200 h-[400px] md:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.3491144155271176!3d6.554823622724379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d2f9e2e5e5d%3A0x5d5e5e5e5e5e5e5e!2s10%20Oba%20Akinjobi%20Way%2C%20Ikeja%20GRA%2C%20Lagos!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                  title="RCCG Salvation Centre Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Times Section */}
      <div className="py-20 md:py-32 relative overflow-hidden bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="times-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="3" fill="#000000"/>
                <circle cx="20" cy="20" r="2" fill="#666666"/>
                <circle cx="80" cy="20" r="2" fill="#666666"/>
                <circle cx="20" cy="80" r="2" fill="#666666"/>
                <circle cx="80" cy="80" r="2" fill="#666666"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#times-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Service Times</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceTimes.map((service, index) => (
              <div 
                key={index} 
                className="bg-linear-to-br from-gray-50/50 to-gray-100/30 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-200 backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-gray-600 to-black flex items-center justify-center text-white font-bold text-lg mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-700 text-lg font-medium">{service.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prayer Request Form */}
      <div className="py-20 md:py-32 relative overflow-hidden bg-black">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="prayer-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Cross pattern */}
                <path d="M60 0 L60 120 M0 60 L120 60" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
                {/* Corner squares */}
                <rect x="0" y="0" width="15" height="15" fill="#ffffff"/>
                <rect x="105" y="0" width="15" height="15" fill="#ffffff"/>
                <rect x="0" y="105" width="15" height="15" fill="#ffffff"/>
                <rect x="105" y="105" width="15" height="15" fill="#ffffff"/>
                {/* Center circle */}
                <circle cx="60" cy="60" r="8" fill="#ffffff"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#prayer-pattern)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6">
              <span className="text-white font-bold uppercase tracking-widest text-xs">Prayer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Prayer Request
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
              We believe in the power of prayer. Share your needs confidentially — our prayer team will stand with you in faith.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-black relative">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label htmlFor="name" className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all font-medium"
                  placeholder="John Kolapo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-12">
              <label htmlFor="request" className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                Your Prayer Request
              </label>
              <textarea
                id="request"
                name="request"
                rows={8}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all font-medium resize-none"
                placeholder="Tell us how we can pray for you..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-black hover:bg-gray-800 text-white text-xl font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 border-2 border-black hover:border-gray-800"
            >
              <Send className="w-6 h-6" />
              Submit Prayer Request
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}