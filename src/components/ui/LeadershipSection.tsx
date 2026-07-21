// components/ui/LeadershipSection.tsx
"use client";

import Image from 'next/image';

export function LeadershipSection() {
  const pastor = {
    name: 'Pastor Obafemi Oyebode',
    role: 'Senior Pastor',
    image: 'https://res.cloudinary.com/dxlyd19av/image/upload/v1765287088/lead_ygoc5y.jpg',
    bio: 'Leading our congregation with unwavering faith, wisdom, and dedication to God\'s word.',
  };

  return (
    <>
      <div className="container-fluid team py-5 relative overflow-hidden">
        {/* White background with subtle pattern*/}
        <div className="absolute inset-0 bg-white z-0">
          {/* Minimal geometric pattern*/}
          <div className="absolute inset-0 opacity-[0.04]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern 
                  id="leadership-pattern" 
                  x="0" 
                  y="0" 
                  width="100" 
                  height="100" 
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="50" cy="50" r="2" fill="#000000"/>
                  <circle cx="20" cy="20" r="1.5" fill="#000000"/>
                  <circle cx="80" cy="20" r="1.5" fill="#000000"/>
                  <circle cx="20" cy="80" r="1.5" fill="#000000"/>
                  <circle cx="80" cy="80" r="1.5" fill="#000000"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#leadership-pattern)" />
            </svg>
          </div>
        </div>

        <div className="container py-5 relative z-10">
          
          {/* Header */}
          <div 
            className="text-center mx-auto pb-5 wow fadeInUp" 
            style={{ maxWidth: '800px' }}
          >
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <h1 className="display-4 mb-6 text-black font-black tracking-tight">Our Leadership</h1>
            <p className="mb-0 text-gray-700 text-lg">
              Meet our Senior Pastor, a dedicated servant leader called to guide our 
              congregation with faith, wisdom, and compassion.
            </p>
          </div>

          {/* Centered Pastor Card */}
          <div className="row justify-content-center">
            <div 
              className="col-md-8 col-lg-6 wow fadeInUp" 
              data-wow-delay="0.2s"
            >
              <div className="pastor-card">
                <div className="pastor-img">
                  <div className="relative w-full h-96">
                    <Image 
                      src={pastor.image} 
                      alt={pastor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="pastor-content">
                  <h2 className="text-black pastor-name">{pastor.name}</h2>
                  <p className="pastor-role text-gray-600 mb-3">{pastor.role}</p>
                  <div className="divider mx-auto mb-3"></div>
                  <p className="pastor-bio text-gray-700">{pastor.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Container styles */
        .container-fluid {
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
          overflow: hidden;
        }

        .container {
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
        }

        @media (min-width: 576px) {
          .container {
            max-width: 540px;
          }
        }

        @media (min-width: 768px) {
          .container {
            max-width: 720px;
          }
        }

        @media (min-width: 992px) {
          .container {
            max-width: 960px;
          }
        }

        @media (min-width: 1200px) {
          .container {
            max-width: 1140px;
          }
        }

        /* Row and Column Grid */
        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .justify-content-center {
          justify-content: center !important;
        }

        .col-md-8 {
          flex: 0 0 66.666667%;
          max-width: 66.666667%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-lg-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding-right: 15px;
          padding-left: 15px;
        }

        @media (max-width: 767px) {
          .col-md-8 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        @media (min-width: 992px) {
          .col-lg-6 {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        /* Spacing utilities */
        .py-5 {
          padding-top: 3rem !important;
          padding-bottom: 3rem !important;
        }

        .pb-5 {
          padding-bottom: 3rem !important;
        }

        .mb-3 {
          margin-bottom: 1rem !important;
        }

        .mb-6 {
          margin-bottom: 1.5rem !important;
        }

        .mb-0 {
          margin-bottom: 0 !important;
        }

        .mx-auto {
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .text-center {
          text-align: center !important;
        }

        /* Pastor Card Styles - Enhanced for single pastor */
        .pastor-card {
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pastor-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .pastor-img {
          position: relative;
          overflow: hidden;
          border: 5px solid #000000;
          transition: 0.5s;
        }

        .pastor-img img {
          transition: 0.5s;
        }

        .pastor-card:hover .pastor-img img {
          transform: scale(1.05);
        }

        .pastor-img::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.3);
          transition: 0.5s;
          z-index: 1;
        }

        .pastor-card:hover .pastor-img::after {
          height: 100%;
        }

        .pastor-content {
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 2rem;
          border: 5px solid #000000;
          border-top: none;
          background: white;
          transition: 0.5s;
        }

        .pastor-content::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 0;
          top: 0;
          left: 0;
          background: #000000;
          transition: 0.5s;
          z-index: -1;
        }

        .pastor-card:hover .pastor-content::after {
          height: 100%;
        }

        .pastor-name {
          transition: 0.5s;
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          color: #000000;
          letter-spacing: -0.02em;
        }

        .pastor-card:hover .pastor-name {
          color: #FFFFFF;
        }

        .pastor-role {
          transition: 0.5s;
          font-size: 1.125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6B7280;
        }

        .pastor-card:hover .pastor-role {
          color: #E5E7EB;
        }

        .divider {
          width: 60px;
          height: 3px;
          background: #000000;
          transition: 0.5s;
        }

        .pastor-card:hover .divider {
          background: #FFFFFF;
          width: 80px;
        }

        .pastor-bio {
          transition: 0.5s;
          font-size: 1rem;
          line-height: 1.75;
          color: #374151;
        }

        .pastor-card:hover .pastor-bio {
          color: #F3F4F6;
        }

        /* Display-4 utility */
        .display-4 {
          font-size: calc(1.475rem + 2.7vw);
          font-weight: 900;
          line-height: 1.2;
          color: #000000;
          letter-spacing: -0.02em;
        }

        @media (min-width: 1200px) {
          .display-4 {
            font-size: 3.5rem;
          }
        }

        /* Wow animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .wow.fadeInUp {
          animation-name: fadeInUp;
          animation-duration: 1s;
          animation-fill-mode: both;
        }

        .w-24 {
          width: 6rem;
        }

        .h-1 {
          height: 0.25rem;
        }

        .h-96 {
          height: 24rem;
        }

        /* Relative positioning for Next.js Image */
        .relative {
          position: relative;
        }

        .overflow-hidden {
          overflow: hidden;
        }

        .object-cover {
          object-fit: cover;
        }

        .w-full {
          width: 100%;
        }

        /* Font weights */
        .font-black {
          font-weight: 900;
        }

        /* Text utilities */
        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }

        .tracking-tight {
          letter-spacing: -0.025em;
        }

        /* Text colors */
        .text-black {
          color: #000000;
        }

        .text-gray-600 {
          color: #4b5563;
        }

        .text-gray-700 {
          color: #374151;
        }

        /* Background colors */
        .bg-white {
          background-color: #ffffff;
        }

        .bg-black {
          background-color: #000000;
        }

        /* Absolute positioning */
        .absolute {
          position: absolute;
        }

        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        /* Z-index utilities */
        .z-0 {
          z-index: 0;
        }

        .z-10 {
          z-index: 10;
        }

        /* Responsive adjustments */
        @media (max-width: 767px) {
          .pastor-name {
            font-size: 1.75rem;
          }

          .h-96 {
            height: 20rem;
          }

          .pastor-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}