import api from './api';

export interface Event {
  id: string;
  name: string;
  location: string;
  startDatetime: string;
  endDatetime: string;
  description: string;
  createdBy: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  resources?: any[];
}

export interface CreateEventData {
  name: string;
  location: string;
  startDatetime: string;
  endDatetime: string;
  description: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

/**
 * Get all events
 */
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events');
  return response.data;
};

/**
 * Get a single event
 */
export const getEvent = async (id: string): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

/**
 * Create a new event
 */
export const createEvent = async (data: CreateEventData): Promise<Event> => {
  const response = await api.post('/events', data);
  return response.data;
};

/**
 * Update an event
 */
export const updateEvent = async (id: string, data: UpdateEventData): Promise<Event> => {
  const response = await api.put(`/events/${id}`, data);
  return response.data;
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};

/**
 * Get event resources
 */
export const getEventResources = async (eventId: string) => {
  const response = await api.get(`/events/${eventId}/resources`);
  return response.data;
};

/**
 * Allocate resource to event
 */
export const allocateResource = async (
  eventId: string,
  resourceId: string,
  allocatedQuantity: number
) => {
  const response = await api.post(`/events/${eventId}/resources`, {
    resourceId,
    allocatedQuantity,
  });
  return response.data;
};

/**
 * Update resource allocation
 */
export const updateResourceAllocation = async (
  eventId: string,
  resourceId: string,
  allocatedQuantity: number
) => {
  const response = await api.put(`/events/${eventId}/resources/${resourceId}`, {
    allocatedQuantity,
  });
  return response.data;
};

/**
 * Remove resource allocation
 */
export const deallocateResource = async (eventId: string, resourceId: string) => {
  await api.delete(`/events/${eventId}/resources/${resourceId}`);
};
