/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from 'react';
import { dashboardApi } from '../../lib/api/dashboard';
import { adminGetPrayerRequests } from '../../lib/api/prayer-requests';
import { DashboardData } from '../../lib/types/dashboard';
import { StatsSection } from './stats-section';
import { AttendanceChart } from './attendance-chart';
import { UpcomingScheduleSection } from './upcoming-schedule-section';
import { QuickActionsSection } from './quick-actions-section';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export function DashboardContainer() {
  const [data, setData] = useState<DashboardData & { totalPrayerRequests?: number; pendingPrayerRequests?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      setAuthError(false);

      const [dashboardResponse, prayerResponse] = await Promise.all([
        dashboardApi.getDashboard(),
        adminGetPrayerRequests()
      ]);

      const dashboardData = dashboardResponse;

      const prayerRequests = prayerResponse.success && prayerResponse.data 
        ? prayerResponse.data 
        : [];

      const pendingPrayers = prayerRequests.filter((p: any) => p.status === 'pending').length;
      const totalPrayers = prayerRequests.length;

      const processedData = {
        totalSermons: dashboardData.totalSermons || 0,
        pendingTestimonies: dashboardData.pendingTestimonies || 0,
        todaysFirstTimers: dashboardData.todaysFirstTimers || 0,
        upcomingEvents: dashboardData.upcomingEvents || [],
        attendanceStats: dashboardData.attendanceStats || [],
        attendanceTrend: dashboardData.attendanceTrend || 'No data',
        totalPrayerRequests: totalPrayers,
        pendingPrayerRequests: pendingPrayers
      };

      setData(processedData);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);

      if (error.code === 403 || error.httpStatus === 403) {
        setAuthError(true);
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please try logging out and back in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }

      setData({
        totalSermons: 0,
        pendingTestimonies: 0,
        todaysFirstTimers: 0,
        upcomingEvents: [],
        attendanceStats: [],
        attendanceTrend: 'No data',
        totalPrayerRequests: 0,
        pendingPrayerRequests: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-black flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 animate-spin text-black" />
          <div>
            <p className="text-2xl font-black mb-2 text-center">Loading Dashboard</p>
            <div className="w-12 h-1 bg-black mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-black mx-auto mb-6" />
          <div className="mb-6">
            <h3 className="text-3xl font-black mb-4">Authentication Error</h3>
            <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
            <p className="text-gray-700">
              Your session may have expired or you don't have permission to access this data.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all border-2 border-black hover:border-gray-800"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <p className="text-2xl font-black mb-2">Failed to load dashboard data</p>
          <div className="w-12 h-1 bg-black mx-auto"></div>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all border-2 border-black hover:border-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl text-white mb-2 tracking-tight">
            Dashboard<br />
            <span className="italic font-light">Overview</span>
          </h1>
          <div className="w-20 h-1 bg-white mb-4"></div>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center gap-3 px-6 py-3 bg-white border-4 border-black rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
        >
          <RefreshCw className={`w-5 h-5 text-black ${refreshing ? 'animate-spin' : ''}`} />
          <span className="font-black uppercase tracking-wider text-sm">Refresh</span>
        </button>
      </div>

      {/* Stats Section */}
      <StatsSection data={data} />

      {/* Charts & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <AttendanceChart data={data.attendanceStats} />
        </div>
        <div className="space-y-8">
          <QuickActionsSection />
          <UpcomingScheduleSection events={data.upcomingEvents} />
        </div>
      </div>

      {/* Weekly Trend Section */}
      <div className="mt-12 bg-linear-to-br from-gray-50/50 to-gray-100/30 rounded-2xl p-8 border-4 border-black relative">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-black"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>
        
        <div className="mb-6">
          <h3 className="text-3xl font-black mb-4">Weekly Trend</h3>
          <div className="w-16 h-1 bg-black mb-6"></div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`px-6 py-4 rounded-xl font-black text-lg border-4 ${
            data.attendanceTrend?.includes('+') 
              ? 'bg-green-50 border-green-300 text-green-800'
              : data.attendanceTrend?.includes('-')
              ? 'bg-red-50 border-red-300 text-red-800'
              : 'bg-gray-50 border-gray-300 text-gray-800'
          }`}>
            <span>{data.attendanceTrend || 'No data'}</span>
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              {data.attendanceTrend?.includes('+') 
                ? 'Attendance is growing this week!'
                : data.attendanceTrend?.includes('-')
                ? 'Attendance has decreased this week'
                : data.attendanceTrend === 'No change'
                ? 'Attendance remains steady this week'
                : 'No trend data available'}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Based on weekly attendance statistics and comparisons
            </p>
          </div>
        </div>
      </div>
    </>
  );
}