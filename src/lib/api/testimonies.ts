import { apiRequest } from '@/lib/api/client'
import type {
  Testimony,
  SubmitTestimonyFormData,
  UpdateTestimonyStatusData
} from '@/lib/types/testimonies'

// Public Get approved testimonies
export async function getApprovedTestimonies(): Promise<Testimony[]> {
  const response = await apiRequest<Testimony[]>('/api/testimonies')
  return response.data || []
}

// Public Submit new testimony
export async function submitTestimony(data: SubmitTestimonyFormData): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  const response = await apiRequest<{ message?: string }>('/api/testimonies', 'POST', data)
  return {
    success: response.success,
    message: response.data?.message,
    error: response.error
  }
}

// Admin Get all testimonies
export async function getAllTestimonies(): Promise<Testimony[]> {
  const response = await apiRequest<Testimony[]>('/api/admin/testimonies')
  return response.data || []
}

// Admin Update testimony status
export async function updateTestimonyStatus(
  id: string, 
  data: UpdateTestimonyStatusData
): Promise<{
  success: boolean
  testimony?: Testimony
  message?: string
  error?: string
}> {
  const response = await apiRequest<Testimony>(`/api/admin/testimonies/${id}`, 'PUT', data)
  
  return {
    success: response.success,
    testimony: response.data,
    message: response.data?.message as string | undefined,
    error: response.error
  }
}

// Admin Delete testimony
export async function deleteTestimony(id: string): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  const response = await apiRequest<{ message?: string }>(`/api/admin/testimonies/${id}`, 'DELETE')
  return {
    success: response.success,
    message: response.data?.message,
    error: response.error
  }
}

// Get testimony statistics
export async function getTestimonyStats(): Promise<{
  total: number
  pending: number
  approved: number
  rejected: number
}> {
  const testimonies = await getAllTestimonies()
  
  return {
    total: testimonies.length,
    pending: testimonies.filter(t => t.status === 'pending').length,
    approved: testimonies.filter(t => t.status === 'approved').length,
    rejected: testimonies.filter(t => t.status === 'rejected').length,
  }
}