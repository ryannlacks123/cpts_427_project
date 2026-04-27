'use client';

import { useAuth } from '@/context/AuthContext';
import { CreateEventData, Event, createEvent, getEvents } from '@/services/events.service';
import { Resource, getResources } from '@/services/resources.service';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const INITIAL_FORM_DATA: CreateEventData = {
  name: '',
  location: '',
  startDatetime: '',
  endDatetime: '',
  description: '',
};

export default function EventsPage() {
  const { hasRole } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEventData>(INITIAL_FORM_DATA);
  const [assigningEventId, setAssigningEventId] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentValues, setAssignmentValues] = useState<Record<string, { resourceId: string; allocatedQuantity: string }>>({});

  const canManageEvents = hasRole(['ADMIN', 'EVENT_MANAGER']);

  useEffect(() => {
    void loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const [eventsData, resourcesData] = await Promise.all([getEvents(), getResources()]);
      setEvents(eventsData);
      setResources(resourcesData);
      setAssignmentValues(
        Object.fromEntries(
          eventsData.map((event) => [
            event.id,
            {
              resourceId: resourcesData[0]?.id ?? '',
              allocatedQuantity: '1',
            },
          ])
        )
      );
    } catch (loadError) {
      console.error('Error loading events page:', loadError);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllocatedQuantity = (resourceId: string) => {
    return events.reduce((totalAllocated, event) => {
      const eventAllocation = event.resources?.find((item) => item.resourceId === resourceId);
      return totalAllocated + (eventAllocation?.allocatedQuantity ?? 0);
    }, 0);
  };

  const getEventAllocation = (event: Event, resourceId: string) => {
    return event.resources?.find((item) => item.resourceId === resourceId)?.allocatedQuantity ?? 0;
  };

  const getAvailableQuantity = (event: Event, resource: Resource) => {
    const totalAllocated = getAllocatedQuantity(resource.id);
    return Math.max(resource.totalQuantity - totalAllocated, 0);
  };

  const getResourceOptionLabel = (event: Event, resource: Resource) => {
    const availableQuantity = getAvailableQuantity(event, resource);
    const eventAllocation = getEventAllocation(event, resource.id);

    if (eventAllocation > 0) {
      return `${resource.name} (${availableQuantity} available, ${eventAllocation} on this event)`;
    }

    return `${resource.name} (${availableQuantity} available)`;
  };

  const updateAssignmentValue = (eventId: string, name: 'resourceId' | 'allocatedQuantity', value: string) => {
    setAssignmentValues((current) => ({
      ...current,
      [eventId]: {
        resourceId: current[eventId]?.resourceId ?? resources[0]?.id ?? '',
        allocatedQuantity: current[eventId]?.allocatedQuantity ?? '1',
        [name]: value,
      },
    }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const createdEvent = await createEvent(formData);
      setEvents((current) => [createdEvent, ...current]);
      setFormData(INITIAL_FORM_DATA);
    } catch (createError: any) {
      setError(createError.response?.data?.error || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignResource = async (eventId: string) => {
    const assignment = assignmentValues[eventId];
    if (!assignment?.resourceId) {
      setAssignmentError('Select a resource before assigning it');
      return;
    }

    setAssigningEventId(eventId);
    setAssignmentError(null);

    try {
      const { allocateResource } = await import('@/services/events.service');
      await allocateResource(eventId, assignment.resourceId, Number(assignment.allocatedQuantity));
      await loadEvents();
    } catch (assignError: any) {
      setAssignmentError(
        assignError.response?.data?.message ||
        assignError.response?.data?.error ||
        'Failed to assign resource'
      );
    } finally {
      setAssigningEventId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
      </div>

      {canManageEvents && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Event</h2>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="name">Event Name</label>
              <input
                id="name"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                className="input"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="startDatetime">Start</label>
              <input
                id="startDatetime"
                name="startDatetime"
                type="datetime-local"
                className="input"
                value={formData.startDatetime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="endDatetime">End</label>
              <input
                id="endDatetime"
                name="endDatetime"
                type="datetime-local"
                className="input"
                value={formData.endDatetime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="input min-h-28"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="md:col-span-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{event.location}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Start: {format(new Date(event.startDatetime), 'MMM d, yyyy h:mm a')}</p>
                <p>End: {format(new Date(event.endDatetime), 'MMM d, yyyy h:mm a')}</p>
              </div>
              {event.creator && (
                <p className="text-xs text-gray-500 mt-3">Created by: {event.creator.name}</p>
              )}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900">Assigned Resources</h4>
                {event.resources && event.resources.length > 0 ? (
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    {event.resources.map((item) => (
                      <div key={item.resourceId} className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2">
                        <span>{item.resource.name}</span>
                        <span className="text-xs text-gray-500">Qty: {item.allocatedQuantity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No resources assigned yet.</p>
                )}

                {canManageEvents && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_110px_auto] sm:items-end">
                      <div>
                        <label className="label" htmlFor={`resource-${event.id}`}>Resource</label>
                        <select
                          id={`resource-${event.id}`}
                          className="input"
                          value={assignmentValues[event.id]?.resourceId ?? ''}
                          onChange={(changeEvent) => updateAssignmentValue(event.id, 'resourceId', changeEvent.target.value)}
                          disabled={resources.length === 0 || assigningEventId === event.id}
                        >
                          {resources.length === 0 ? (
                            <option value="">No resources available</option>
                          ) : (
                            resources.map((resource) => (
                              <option key={resource.id} value={resource.id}>
                                {getResourceOptionLabel(event, resource)}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="label" htmlFor={`quantity-${event.id}`}>Quantity</label>
                        <input
                          id={`quantity-${event.id}`}
                          type="number"
                          min="1"
                          className="input"
                          value={assignmentValues[event.id]?.allocatedQuantity ?? '1'}
                          onChange={(changeEvent) => updateAssignmentValue(event.id, 'allocatedQuantity', changeEvent.target.value)}
                          disabled={assigningEventId === event.id}
                        />
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => void handleAssignResource(event.id)}
                        disabled={resources.length === 0 || assigningEventId === event.id}
                      >
                        {assigningEventId === event.id ? 'Assigning...' : 'Assign'}
                      </button>
                    </div>

                    {assignmentError && assigningEventId === null && (
                      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {assignmentError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
