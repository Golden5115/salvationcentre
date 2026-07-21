
export interface SpecialEvent {
  id: number;
  title: string;
  type: string;
  description?: string;
  date: string; 
  startTime?: string;
  endTime?: string;
  location?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpecialEventInput {
  title: string;
  type: string;
  description?: string;
  date: string; 
  startTime?: string;
  endTime?: string;
  location?: string;
  published?: boolean;
}

export interface UpdateSpecialEventInput {
  title?: string;
  type?: string;
  description?: string;
  date?: string; 
  startTime?: string;
  endTime?: string;
  location?: string;
  published?: boolean;
}

export interface SpecialEventResponse {
  success: boolean;
  data?: SpecialEvent[];
  error?: string;
}

export interface SingleSpecialEventResponse {
  success: boolean;
  data?: SpecialEvent;
  error?: string;
}