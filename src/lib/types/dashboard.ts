
export interface DashboardData {
  totalSermons: number;
  pendingTestimonies: number;
  todaysFirstTimers: number;
  upcomingEvents: UpcomingEvent[];
  attendanceStats: AttendanceStat[];
  attendanceTrend: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string; 
}

export interface AttendanceStat {
  date: string; 
  total: number;
  adults: number;
  children: number;
}

export interface DashboardStats {
  data: DashboardData;
}