

export interface PrayerRequest {
  id: number;
  name: string;
  email: string;
  request: string;
  status: 'pending' | 'prayed' | 'archived';
  submittedAt: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrayerRequestInput {
  name: string;
  email: string;
  request: string;
}

export interface UpdatePrayerRequestInput {
  name?: string;
  email?: string;
  request?: string;
  status?: 'pending' | 'prayed' | 'archived';
}

export interface PrayerRequestResponse {
  success: boolean;
  data?: PrayerRequest[];
  error?: string;
}

export interface SinglePrayerRequestResponse {
  success: boolean;
  data?: PrayerRequest;
  error?: string;
}