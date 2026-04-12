import api from './api';

/**
 * Get resource usage by event
 */
export const getResourceUsageByEvent = async (eventId: string) => {
  const response = await api.get(`/reports/events/${eventId}/usage`);
  return response.data;
};

/**
 * Get vendor resource usage
 */
export const getVendorResourceUsage = async () => {
  const response = await api.get('/reports/vendors/usage');
  return response.data;
};

/**
 * Get inventory availability
 */
export const getInventoryAvailability = async () => {
  const response = await api.get('/reports/inventory/availability');
  return response.data;
};

/**
 * Get usage over time
 */
export const getUsageOverTime = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await api.get(`/reports/usage/timeline?${params.toString()}`);
  return response.data;
};

/**
 * Get low stock alerts
 */
export const getLowStockAlerts = async (threshold?: number) => {
  const params = new URLSearchParams();
  if (threshold !== undefined) params.append('threshold', threshold.toString());
  
  const response = await api.get(`/reports/alerts/low-stock?${params.toString()}`);
  return response.data;
};
