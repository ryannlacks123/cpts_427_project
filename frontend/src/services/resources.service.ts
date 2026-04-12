import api from './api';

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  vendorId: string | null;
  totalQuantity: number;
  createdAt: string;
  vendor?: {
    id: string;
    name: string;
  };
}

export interface CreateResourceData {
  name: string;
  category: string;
  description: string;
  vendorId?: string;
  totalQuantity: number;
}

export interface UpdateResourceData extends Partial<CreateResourceData> {}

/**
 * Get all resources
 */
export const getResources = async (): Promise<Resource[]> => {
  const response = await api.get('/resources');
  return response.data;
};

/**
 * Get a single resource
 */
export const getResource = async (id: string): Promise<Resource> => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

/**
 * Create a new resource
 */
export const createResource = async (data: CreateResourceData): Promise<Resource> => {
  const response = await api.post('/resources', data);
  return response.data;
};

/**
 * Update a resource
 */
export const updateResource = async (id: string, data: UpdateResourceData): Promise<Resource> => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

/**
 * Delete a resource
 */
export const deleteResource = async (id: string): Promise<void> => {
  await api.delete(`/resources/${id}`);
};

/**
 * Get resource usage logs
 */
export const getResourceUsage = async (id: string) => {
  const response = await api.get(`/resources/${id}/usage`);
  return response.data;
};

/**
 * Log resource usage
 */
export const logResourceUsage = async (
  id: string,
  eventId: string,
  change: number,
  notes?: string
) => {
  const response = await api.post(`/resources/${id}/usage`, {
    eventId,
    change,
    notes,
  });
  return response.data;
};
