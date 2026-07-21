

// Main Sermon Interface
export interface Sermon {
  id: number;
  title: string;
  pastor: string;
  service: string;
  date: string;
  youtubeId: string;
  duration?: string;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// For Sermon Card component
export interface SermonCardProps {
  sermon: Omit<Sermon, 'published' | 'createdAt' | 'updatedAt'> & {
    date: string; 
  };
}

// For Sermon Form
export interface SermonFormData {
  title: string;
  pastor: string;
  service: string;
  date: string;
  youtubeId: string; 
  duration?: string;
  description?: string;
  published: boolean;
}

// For updating sermons 
export interface SermonUpdateData {
  title?: string;
  pastor?: string;
  service?: string;
  date?: string;
  youtubeId?: string;
  duration?: string;
  description?: string;
  published?: boolean;
}

// Service Type Interface
export interface ServiceType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Sermons List Response
export interface SermonsResponse {
  data: Sermon[];
  count: number;
}

// Search Response
export interface SearchSermonsResponse {
  query: string;
  data: Sermon[];
  count: number;
}

// Pagination Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter Parameters
export interface SermonFilters {
  service?: string;
  pastor?: string;
  published?: boolean;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

// Combined Request Parameters
export interface SermonRequestParams extends PaginationParams, SermonFilters {}

// YouTube Video Info 
export interface YouTubeVideoInfo {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

// Sermon Statistics (for admin dashboard)
export interface SermonStats {
  totalSermons: number;
  publishedSermons: number;
  draftSermons: number;
  sermonsByService: Record<string, number>;
  sermonsByPastor: Record<string, number>;
  recentSermons: Sermon[];
}

// Import/Export Types 
export interface SermonImportData {
  title: string;
  pastor: string;
  service: string;
  date: string;
  youtubeId: string;
  duration?: string;
  description?: string;
  published: boolean;
}

export interface SermonExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeUnpublished?: boolean;
  startDate?: string;
  endDate?: string;
  services?: string[];
}

// Sermon Bulk Operations
export interface SermonBulkUpdate {
  ids: number[];
  data: Partial<SermonUpdateData>;
}

export interface SermonBulkDelete {
  ids: number[];
}

// Form Validation Types
export interface SermonFormErrors {
  title?: string;
  pastor?: string;
  service?: string;
  date?: string;
  youtubeUrl?: string;
  duration?: string;
  description?: string;
}

// UI State Types
export interface SermonUIState {
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  error: string | null;
  success: string | null;
}

// For React Query/State Management
export interface SermonQueryState {
  data: Sermon[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// File Upload Types (for sermon attachments)
export interface SermonAttachment {
  id: number;
  sermonId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Sermon Series Types
export interface SermonSeries {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  sermons: Sermon[];
}

// Sermon with Series
export interface SermonWithSeries extends Sermon {
  series?: {
    id: number;
    title: string;
  };
}

// Sermon Analytics 
export interface SermonAnalytics {
  sermonId: number;
  views: number;
  likes: number;
  shares: number;
  watchTime: number;
  lastUpdated: string;
}

// Type Guards with proper typing
export function isSermon(obj: unknown): obj is Sermon {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const sermonObj = obj as Record<string, unknown>;
  
  return (
    typeof sermonObj.id === 'number' &&
    typeof sermonObj.title === 'string' &&
    typeof sermonObj.pastor === 'string' &&
    typeof sermonObj.service === 'string' &&
    typeof sermonObj.date === 'string' &&
    typeof sermonObj.youtubeId === 'string' &&
    typeof sermonObj.published === 'boolean'
  );
}

export function isSermonArray(arr: unknown): arr is Sermon[] {
  if (!Array.isArray(arr)) return false;
  return arr.every(isSermon);
}

// Utility Types
export type SermonSortField = 'date' | 'title' | 'pastor' | 'service' | 'createdAt';
export type SermonSortOrder = 'asc' | 'desc';

export interface SermonSortOptions {
  field: SermonSortField;
  order: SermonSortOrder;
}

// Type for sermon table columns (for admin)
export interface SermonTableColumn {
  key: keyof Sermon | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, sermon: Sermon) => React.ReactNode;
}

// Sermon filter options for UI
export interface SermonFilterOptions {
  services: string[];
  pastors: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

// Helper function to format sermon date
export function formatSermonDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Helper function to validate YouTube URL
export function extractYouTubeId(url: string): string {
  if (!url) return '';
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1].substring(0, 11);
    }
  }
  
  return '';
}

// Helper function to get YouTube thumbnail URL
export function getYouTubeThumbnail(youtubeId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  const qualities = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${youtubeId}/${qualities[quality]}`;
}

// Helper function to validate sermon form data
export function validateSermonForm(data: Partial<SermonFormData>): SermonFormErrors {
  const errors: SermonFormErrors = {};
  
  if (!data.title?.trim()) {
    errors.title = 'Sermon title is required';
  }
  
  if (!data.pastor?.trim()) {
    errors.pastor = 'Pastor name is required';
  }
  
  if (!data.service?.trim()) {
    errors.service = 'Service type is required';
  }
  
  if (!data.date?.trim()) {
    errors.date = 'Date is required';
  }
  
  if (!data.youtubeId?.trim()) {
    errors.youtubeUrl = 'Valid YouTube URL is required';
  }
  
  return errors;
}

// Type for form field change handlers
export type SermonFormField = keyof SermonFormData;

// Type for sermon listing filters
export interface SermonListingFilters {
  search?: string;
  service?: string;
  pastor?: string;
  published?: boolean;
  year?: number;
  month?: number;
}

// Type for sermon preview data
export interface SermonPreview {
  title: string;
  pastor: string;
  service: string;
  date: string;
  youtubeId: string;
  thumbnailUrl: string;
}

// Type for sermon selection in bulk operations
export interface SelectedSermon {
  id: number;
  title: string;
  selected: boolean;
}

// Type for sermon import results
export interface SermonImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// Type for sermon export result
export interface SermonExportResult {
  fileName: string;
  downloadUrl: string;
  count: number;
}

// Type for sermon duplicate check
export interface SermonDuplicateCheck {
  isDuplicate: boolean;
  existingSermon?: Sermon;
  message?: string;
}