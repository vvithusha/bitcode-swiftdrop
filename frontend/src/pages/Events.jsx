import { useEffect, useState } from 'react';
import { fetchEvents } from '../api/marketplace';
import AppLayout from '../components/AppLayout';
import EventCard from '../components/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchEvents()
      .then((res) => {
        if (mounted) {
          setEvents(res.data?.data?.events || []);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.response?.data?.message || 'Unable to load events');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">SwiftDrop Events</h1>
        <p className="text-slate-400">Join the fastest flash sales happening now.</p>
      </div>
      {loading && <p className="text-slate-400">Loading events...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg">
          {error}
        </div>
      )}
      {!loading && !error && events.length === 0 && (
        <p className="text-slate-400">No events available.</p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </AppLayout>
  );
}
