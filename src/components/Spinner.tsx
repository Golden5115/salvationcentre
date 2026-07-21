'use client';
import { useEffect } from 'react';

export default function Spinner() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const spinner = document.getElementById('page-spinner');
      if (spinner) spinner.style.opacity = '0';
      setTimeout(() => spinner?.remove(), 600);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="page-spinner"
      className="fixed inset-0 bg-light z-[9999] flex items-center justify-center transition-opacity duration-700"
    >
      <div className="w-16 h-16 border-4 border-dark border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}