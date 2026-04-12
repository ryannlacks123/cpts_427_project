'use client';

import { Event, getEvents } from '@/services/events.service';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
      </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
