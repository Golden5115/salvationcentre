// src/api/first-timers.ts
import { apiRequest } from "./client";
import type { FirstTimer } from "@/lib/types/first-timer";

interface UpdateInput {
  followUpStatus?: string;
  status?: string;
}

export const getFirstTimers = () => apiRequest<FirstTimer[]>("/api/admin/first-timers");

export const createFirstTimer = (data: Partial<FirstTimer>) =>
  apiRequest<{ message: string }>("/api/first-timers", "POST", data);

export const updateFirstTimer = (id: string, data: UpdateInput) =>
  apiRequest<FirstTimer>(`/api/admin/first-timers/${id}`, "PUT", data);

export const deleteFirstTimer = (id: string) =>
  apiRequest<{ message: string }>(`/api/admin/first-timers/${id}`, "DELETE");