/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api/client";
import { extractYouTubeId, isValidYouTubeId, getYouTubeThumbnail } from "@/lib/utils/youtube";
import {
  Loader2,
  ArrowLeft,
  Save,
  Calendar,
  User,
  Clock,
  Link2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Youtube,
} from "lucide-react";

interface ServiceType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  pastor: string;
  service: string;
  date: string;
  youtubeId: string;
  duration: string;
  description: string;
  published: boolean;
}

export default function SermonFormPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [youtubeIdValid, setYoutubeIdValid] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    pastor: "",
    service: "",
    date: new Date().toISOString().split("T")[0],
    youtubeId: "",
    duration: "",
    description: "",
    published: false,
  });

  // Fetch service types from backend
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await apiRequest<{ data: ServiceType[] }>("/api/service-types");
        
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            setServiceTypes(res.data);
          } else if (res.data.data && Array.isArray(res.data.data)) {
            setServiceTypes(res.data.data);
          } else {
            throw new Error("Invalid response structure");
          }
        } else {
          throw new Error(res.error || "Failed to load service types");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Could not load service types",
          variant: "destructive",
        });
        setServiceTypes([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServiceTypes();
  }, [toast]);

  // Handle YouTube URL input change
  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    
    // Extract YouTube ID from the URL (preserving case)
    const id = extractYouTubeId(url);
    
    if (id) {
      setYoutubeId(id);
      const isValid = isValidYouTubeId(id);
      setYoutubeIdValid(isValid);
      setFormData(prev => ({ ...prev, youtubeId: id }));
      
      // Try maxres thumbnail first
      const maxresUrl = getYouTubeThumbnail(id, 'maxres');
      setThumbnailUrl(maxresUrl);
    } else {
      setYoutubeId("");
      setYoutubeIdValid(false);
      setFormData(prev => ({ ...prev, youtubeId: "" }));
      setThumbnailUrl("");
    }
  };

  // Handle thumbnail load errors
  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // Try different thumbnail qualities
    const qualities = ['maxres', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
    const qualityMap: Record<string, string> = {
      'maxresdefault.jpg': 'maxres',
      'sddefault.jpg': 'sddefault',
      'hqdefault.jpg': 'hqdefault',
      'mqdefault.jpg': 'mqdefault',
      'default.jpg': 'default'
    };
    
    const currentQualityKey = qualityMap[currentSrc.split('/').pop() || ''] || 'maxres';
    const currentIndex = qualities.indexOf(currentQualityKey);
    
    if (currentIndex < qualities.length - 1) {
      const nextQuality = qualities[currentIndex + 1];
      img.src = getYouTubeThumbnail(youtubeId, nextQuality as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!formData.title.trim()) {
      errors.push("Sermon title is required");
    }
    
    if (!formData.pastor.trim()) {
      errors.push("Pastor name is required");
    }
    
    if (!formData.service.trim()) {
      errors.push("Service type is required");
    }
    
    if (!formData.youtubeId.trim()) {
      errors.push("YouTube URL is required");
    } else if (!youtubeIdValid) {
      errors.push("Invalid YouTube ID format");
    }
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting form data:", formData);

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        pastor: formData.pastor.trim(),
        service: formData.service.trim(),
        date: formData.date,
        youtubeId: formData.youtubeId.trim(),
        duration: formData.duration?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        published: formData.published,
      };

      console.log("API Payload:", payload);

      const res = await apiRequest<any>("/api/admin/sermons", "POST", payload);

      console.log("API Response:", res);

      if (res.success) {
        toast({
          title: "Success!",
          description: "Sermon added successfully",
        });
        router.push("/admin/sermons");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to save sermon",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Network Error",
        description: error.message || "Could not save sermon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if form is ready for submission
  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.pastor.trim() &&
      formData.service.trim() &&
      formData.youtubeId.trim() &&
      youtubeIdValid
    );
  };

  if (!user) {
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
            <Loader2 className="w-16 h-16 animate-spin" />
            <div>
              <p className="text-2xl font-black mb-2 text-center">Loading Form</p>
              <div className="w-12 h-1 bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          onLogout={logout}
        />

        <div className="lg:pl-64">
          <Header user={user} onMenuClick={() => setSidebarOpen(true)} onLogout={logout} />

          <main className="p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-10">
                <Link 
                  href="/admin/sermons" 
                  className="inline-flex items-center gap-2 text-white font-bold hover:opacity-70 transition-opacity mb-6 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Sermons
                </Link>
                
                <div className="inline-block border-2 border-white/30 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Add New</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Add New<br />
                  <span className="italic font-light">Sermon</span>
                </h1>
                
                <div className="w-24 h-1 bg-white mb-6"></div>
                
                <p className="text-lg text-white/80 max-w-3xl font-light">
                  Fill in the details below to add a new sermon to the church library.
                </p>
              </div>

              {/* Form Container */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-black relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                      Sermon Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                      placeholder="e.g. Walking in Victory"
                    />
                  </div>

                  {/* Pastor & Service */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                        <User className="inline-block w-4 h-4 mr-2" />
                        Pastor
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pastor}
                        onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
                        className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                        placeholder="Pastor John Adeyemi"
                      />
                    </div>

                    {/* Dynamic Service Type Dropdown */}
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                        Service Type
                      </label>
                      {loadingServices ? (
                        <div className="px-6 py-4 border-4 border-black rounded-xl text-gray-600 font-medium">
                          Loading service types...
                        </div>
                      ) : (
                        <select
                          required
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 1rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em",
                          }}
                        >
                          <option value="" className="text-gray-500">Select service type</option>
                          {serviceTypes.map((type) => (
                            <option key={type.id} value={type.name} className="text-gray-900">
                              {type.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Date & Duration */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                        <Calendar className="inline-block w-4 h-4 mr-2" />
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                        <Clock className="inline-block w-4 h-4 mr-2" />
                        Duration (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                        placeholder="e.g. 45:30"
                      />
                    </div>
                  </div>

                  {/* YouTube URL + Preview */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                      <Youtube className="inline-block w-4 h-4 mr-2" />
                      YouTube Video URL
                    </label>
                    <div className="relative">
                      <Link2 className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <input
                        type="url"
                        required
                        value={youtubeUrl}
                        onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium"
                        placeholder="Paste any YouTube URL here..."
                      />
                    </div>

                    {/* YouTube ID Validation */}
                    {youtubeUrl && (
                      <div className={`mt-4 p-4 rounded-xl border-4 ${youtubeIdValid ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
                        <div className="flex items-start gap-4">
                          {youtubeIdValid ? (
                            <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              YouTube ID: <code className="bg-black/10 px-2 py-1 rounded font-mono">{youtubeId}</code>
                            </p>
                            <p className={`text-sm mt-2 ${youtubeIdValid ? 'text-green-700' : 'text-yellow-700'}`}>
                              {youtubeIdValid 
                                ? `✓ Valid YouTube ID (${youtubeId.length} characters)`
                                : `⚠ ID length: ${youtubeId.length} characters (expected 8-20)`
                              }
                            </p>
                            {youtubeId && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-900 mb-2">Test Links:</p>
                                <div className="flex flex-wrap gap-3">
                                  <a 
                                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all inline-flex items-center gap-2"
                                  >
                                    <Youtube className="w-4 h-4" />
                                    Watch on YouTube
                                  </a>
                                  <a 
                                    href={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white text-sm font-bold rounded-lg transition-all"
                                  >
                                    Check Thumbnail
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Thumbnail Preview */}
                    {youtubeId && thumbnailUrl && (
                      <div className="mt-6">
                        <p className="text-sm font-black uppercase tracking-widest text-gray-600 mb-3">Video Preview</p>
                        <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-black max-w-2xl">
                          <Image
                            src={thumbnailUrl}
                            alt="YouTube thumbnail"
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                            onError={handleThumbnailError}
                          />
                          {!youtubeIdValid && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
                              <p className="text-white text-sm text-center">
                                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                                Note: YouTube ID may not be standard format.<br />
                                The video may still work, but please verify.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Help text */}
                    <div className="mt-4">
                      <details className="text-gray-600 text-sm">
                        <summary className="cursor-pointer font-medium hover:text-black">Supported YouTube URL formats</summary>
                        <div className="mt-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span>Regular video: https://www.youtube.com/watch?v=dQw4w9WgXcQ</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span>Short URL: https://youtu.be/dQw4w9WgXcQ</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span>Live stream: https://www.youtube.com/live/5t5cJxMN_pE</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span>YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span>Embedded: https://www.youtube.com/embed/dQw4w9WgXcQ</span>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-gray-600 mb-4">
                      Description (optional)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-6 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-black/20 font-medium resize-none"
                      placeholder="Brief summary of the message..."
                    />
                  </div>

                  {/* Publish Toggle */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border-4 border-gray-200">
                    <div>
                      <p className="font-black text-gray-900 text-lg">Publish Immediately?</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Published sermons will be visible to the public immediately
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, published: !formData.published })}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all border-4 ${
                        formData.published 
                          ? "bg-green-500 border-green-600" 
                          : "bg-gray-300 border-gray-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform border-2 ${
                          formData.published ? "translate-x-8 border-green-600" : "translate-x-0 border-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-6 pt-8 border-t-4 border-gray-200">
                    <button
                      type="submit"
                      disabled={loading || !isFormValid()}
                      className={`flex-1 py-5 text-xl font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 border-4 ${
                        isFormValid() 
                          ? 'bg-black hover:bg-gray-800 text-white border-black hover:border-gray-800' 
                          : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          SAVING...
                        </>
                      ) : (
                        <>
                          <Save className="w-6 h-6" />
                          SAVE SERMON
                        </>
                      )}
                    </button>
                    <Link href="/admin/sermons" className="flex-1">
                      <button
                        type="button"
                        className="w-full py-5 text-xl font-black uppercase tracking-wider rounded-xl transition-all border-4 border-black hover:bg-black hover:text-white"
                      >
                        CANCEL
                      </button>
                    </Link>
                  </div>

                  {/* Form Status Summary */}
                  <div className="mt-10 pt-8 border-t-4 border-gray-200">
                    <h4 className="text-2xl font-black text-gray-900 mb-6">Form Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Title", valid: !!formData.title },
                        { label: "Pastor", valid: !!formData.pastor },
                        { label: "Service Type", valid: !!formData.service },
                        { label: "YouTube URL", valid: youtubeIdValid },
                      ].map((item, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-xl border-4 ${item.valid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            {item.valid ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                            <div>
                              <p className="font-bold text-gray-900">{item.label}</p>
                              <p className={`text-sm ${item.valid ? 'text-green-700' : 'text-red-700'}`}>
                                {item.valid ? '✓ Complete' : '✗ Required'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}