
export interface RegularProgram {
  id: number;
  title: string;
  description?: string;
  day: string;
  frequency: string;
  time?: string;
  location?: string;
  type: string; // ADDED - Required field for program type
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegularProgramInput {
  title: string;
  description?: string;
  day: string;
  frequency: string;
  time?: string;
  location?: string;
  type: string; // ADDED - Required field for program type
  active?: boolean;
}

export interface UpdateRegularProgramInput {
  title?: string;
  description?: string;
  day?: string;
  frequency?: string;
  time?: string;
  location?: string;
  type?: string; // ADDED - Optional for updates
  active?: boolean;
}

export interface RegularProgramResponse {
  success: boolean;
  data?: RegularProgram[];
  error?: string;
}

export interface SingleRegularProgramResponse {
  success: boolean;
  data?: RegularProgram;
  error?: string;
}