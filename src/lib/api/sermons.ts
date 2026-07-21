// src/lib/api/sermons.ts
import { Sermon, ApiResponse, SermonsResponse } from '../types/sermon';
import { apiRequest } from "./client";

export async function getAllSermons(): Promise<ApiResponse<SermonsResponse>> {
  return apiRequest<SermonsResponse>("/api/admin/sermons");
}

export async function getPublishedSermons(): Promise<ApiResponse<SermonsResponse>> {
  return apiRequest<SermonsResponse>("/api/sermons");
}

// ADD THIS FUNCTION
export async function getLatestSermon(): Promise<ApiResponse<Sermon>> {
  return apiRequest<Sermon>("/api/sermons/latest");
}

export async function createSermon(data: Partial<Sermon>): Promise<ApiResponse<Sermon>> {
  return apiRequest<Sermon>("/api/admin/sermons", "POST", data);
}

export async function updateSermon(id: number, data: Partial<Sermon>): Promise<ApiResponse<Sermon>> {
  return apiRequest<Sermon>(`/api/admin/sermons/${id}`, "PUT", data);
}

export async function deleteSermon(id: number): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/admin/sermons/${id}`, "DELETE");
}