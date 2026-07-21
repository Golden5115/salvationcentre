export interface AttendanceRecord {
  id: number;
  date: string;
  serviceType: string;
  adults: number;
  children: number;
  total: number;
  firstTimers: number;
  visitors: number;
  members: number;
  notes?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  date: string; 
  serviceType: string;
  adults: number;
  children: number;
  total: number;
  firstTimers: number;
  visitors: number;
  members: number;
  notes?: string;
}

export interface UpdateAttendanceDto {
  serviceType?: string;
  adults?: number;
  children?: number;
  total?: number;
  firstTimers?: number;
  visitors?: number;
  members?: number;
  notes?: string;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
}

export interface AttendanceCreateResponse {
  message?: string;
  attendance: AttendanceRecord;
}

export interface AttendanceUpdateResponse {
  message?: string;
  attendance: AttendanceRecord;
}

export interface AttendanceDeleteResponse {
  message?: string;
}