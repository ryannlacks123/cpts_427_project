import api from './api';

export interface VendorResource {
  id: string;
  name: string;
  category: string;
  description: string;
  totalQuantity: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  resources?: VendorResource[];
}

export interface CreateVendorData {
  name: string;
  contactName: string;
  contactEmail: string;
  phone: string;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {}

/**
 * Get all vendors
 */
export const getVendors = async (): Promise<Vendor[]> => {
  const response = await api.get('/vendors');
  return response.data;
};

/**
 * Get a single vendor
 */
export const getVendor = async (id: string): Promise<Vendor> => {
  const response = await api.get(`/vendors/${id}`);
  return response.data;
};

/**
 * Create a new vendor
 */
export const createVendor = async (data: CreateVendorData): Promise<Vendor> => {
  const response = await api.post('/vendors', data);
  return response.data;
};

/**
 * Update a vendor
 */
export const updateVendor = async (id: string, data: UpdateVendorData): Promise<Vendor> => {
  const response = await api.put(`/vendors/${id}`, data);
  return response.data;
};

/**
 * Delete a vendor
 */
export const deleteVendor = async (id: string): Promise<void> => {
  await api.delete(`/vendors/${id}`);
};
