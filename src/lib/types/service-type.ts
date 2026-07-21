export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface ServiceTypeResponse {
  success?: boolean;
  data: ServiceType[];
}