import { apiRequest } from './client';
import type { 
  AttendanceRecord, 
  CreateAttendanceDto, 
  UpdateAttendanceDto,
  AttendanceListResponse,
  AttendanceCreateResponse,
  AttendanceUpdateResponse,
  AttendanceDeleteResponse
} from '../types/attendance';

// GET /api/admin/attendance
export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  const response = await apiRequest<AttendanceListResponse>('/api/admin/attendance');
  
  if (response.success && response.data) {
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
  }
  
  throw new Error(response.error || 'Failed to fetch attendance records');
}

// POST /api/admin/attendance
export async function createAttendance(data: CreateAttendanceDto): Promise<AttendanceRecord> {
  const response = await apiRequest<AttendanceCreateResponse>('/api/admin/attendance', 'POST', data);
  
  if (response.success && response.data) {
    if (response.data.attendance) {
      return response.data.attendance;
    }
  }
  
  throw new Error(response.error || 'Failed to create attendance record');
}

// PUT /api/admin/attendance/:id
export async function updateAttendance(id: number, data: UpdateAttendanceDto): Promise<AttendanceRecord> {
  const response = await apiRequest<AttendanceUpdateResponse>(`/api/admin/attendance/${id}`, 'PUT', data);
  
  if (response.success && response.data) {
    if (response.data.attendance) {
      return response.data.attendance;
    }
  }
  
  throw new Error(response.error || 'Failed to update attendance record');
}

// DELETE /api/admin/attendance/:id
export async function deleteAttendance(id: number): Promise<void> {
  const response = await apiRequest<AttendanceDeleteResponse>(`/api/admin/attendance/${id}`, 'DELETE');
  
  if (!response.success) {
    throw new Error(response.error || 'Failed to delete attendance record');
  }
}