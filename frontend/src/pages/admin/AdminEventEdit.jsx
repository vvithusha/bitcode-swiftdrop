import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { fetchEvent } from '../../api/marketplace';
import { updateEvent, updateEventStatus } from '../../api/admin';

export default function AdminEventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', coverPhotoUrl: '', scheduledAt: '' });
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('LOCKED');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent(id)
      .then((res) => {
        const event = res.data?.data?.event;
        if (event) {
          setForm({
            name: event.name,
            coverPhotoUrl: event.coverPhotoUrl,
            scheduledAt: new Date(event.scheduledAt).toISOString().slice(0, 16)
          });
          setItems((event.items || []).map((item) => ({
            name: item.name,
            coverPhotoUrl: item.coverPhotoUrl,
            unitPrice: item.unitPrice,
            stockQuantity: item.stockQuantity
          })));
          setStatus(event.status);
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleItemChange = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateEvent(id, {
        ...form,
        items: items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          stockQuantity: Number(item.stockQuantity)
        }))
      });
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (nextStatus) => {
    setSaving(true);
    setError('');
    try {
      await updateEventStatus(id, { status: nextStatus });
      setStatus(nextStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      {loading && <p className="text-slate-400">Loading...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      {!loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Edit Event</h1>
            <div className="flex gap-2">
              <button className="text-emerald-300" onClick={() => handleStatus('LIVE')} disabled={saving}>Go Live</button>
              <button className="text-rose-300" onClick={() => handleStatus('CLOSED')} disabled={saving}>Close</button>
              <span className="text-xs text-slate-400">Status: {status}</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-lg bg-slate-900/70 border border-slate-800 text-slate-100 px-3 py-2"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="rounded-lg bg-slate-900/70 border border-slate-800 text-slate-100 px-3 py-2"
              name="coverPhotoUrl"
              value={form.coverPhotoUrl}
              onChange={handleChange}
            />
            <input
              className="rounded-lg bg-slate-900/70 border border-slate-800 text-slate-100 px-3 py-2"
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Items</h2>
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <input
                  className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                  value={item.name}
                  onChange={(event) => handleItemChange(index, 'name', event.target.value)}
                />
                <input
                  className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                  value={item.coverPhotoUrl}
                  onChange={(event) => handleItemChange(index, 'coverPhotoUrl', event.target.value)}
                />
                <input
                  className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                  type="number"
                  value={item.unitPrice}
                  onChange={(event) => handleItemChange(index, 'unitPrice', event.target.value)}
                />
                <input
                  className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                  type="number"
                  value={item.stockQuantity}
                  onChange={(event) => handleItemChange(index, 'stockQuantity', event.target.value)}
                />
              </div>
            ))}
          </div>
          <button className="bg-brand-500 hover:bg-brand-400 transition text-white font-semibold px-4 py-2 rounded-lg" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}
    </AppLayout>
  );
}
