import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { fetchAdminDashboard, updateEventStatus } from '../../api/admin';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);

export default function AdminEvents() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = () => {
    setLoading(true);
    fetchAdminDashboard()
      .then((res) => setDashboard(res.data?.data || null))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatus = async (eventId, status) => {
    try {
      await updateEventStatus(eventId, { status });
      loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status');
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage events and track revenue.</p>
        </div>
        <Link className="bg-brand-500 hover:bg-brand-400 transition text-white px-4 py-2 rounded-lg" to="/admin/events/new">
          New Event
        </Link>
      </div>

      {loading && <p className="text-slate-400">Loading...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {dashboard && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400">Revenue</p>
              <p className="text-xl font-semibold">{formatCurrency(dashboard.revenue)}</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400">Units Sold</p>
              <p className="text-xl font-semibold">{dashboard.unitsSold}</p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-400">Users</p>
              <p className="text-xl font-semibold">{dashboard.userCount}</p>
            </div>
          </div>

          <div className="space-y-3">
            {dashboard.events?.map((event) => (
              <div key={event.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-slate-400">{event.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link className="text-sm text-brand-300" to={`/admin/events/${event.id}/edit`}>Edit</Link>
                    <button className="text-sm text-emerald-300" onClick={() => handleStatus(event.id, 'LIVE')}>Go Live</button>
                    <button className="text-sm text-rose-300" onClick={() => handleStatus(event.id, 'CLOSED')}>Close</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
