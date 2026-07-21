export type TestimonyStatus = 'pending' | 'approved' | 'rejected'

export interface Testimony {
  id: string
  name: string
  title: string
  message: string
  email?: string
  phone?: string
  status: TestimonyStatus
  approvedAt?: string
  rejectedAt?: string
  submittedAt: string
}

// Form types
export interface SubmitTestimonyFormData {
  name: string
  title: string
  message: string
  email?: string
  phone?: string
}

export interface UpdateTestimonyStatusData {
  status: 'approved' | 'rejected'
}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

export interface TestimoniesResponse {
  data: Testimony[]
}

export interface TestimonyResponse {
  data: Testimony
  message?: string
}