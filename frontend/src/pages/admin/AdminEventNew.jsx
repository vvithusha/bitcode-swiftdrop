import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { createEvent } from '../../api/admin';

export default function AdminEventNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    coverPhotoUrl: '',
    scheduledAt: ''
  });
  const [items, setItems] = useState([
    { name: '', coverPhotoUrl: '', unitPrice: '', stockQuantity: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, { name: '', coverPhotoUrl: '', unitPrice: '', stockQuantity: '' }]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createEvent({
        ...form,
        items: items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          stockQuantity: Number(item.stockQuantity)
        }))
      });
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Create Event</h1>
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-lg bg-slate-900/70 border border-slate-800 text-slate-100 px-3 py-2"
            placeholder="Event name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="rounded-lg bg-slate-900/70 border border-slate-800 text-slate-100 px-3 py-2"
            placeholder="Cover photo URL"
            name="coverPhotoUrl"
            value={form.coverPhotoUrl}
            onChange={handleChange}
            required
          />
          <input
            className="rounded-lg bg-slate-900/70 border border-slate-800 text-slate-100 px-3 py-2"
            type="datetime-local"
            name="scheduledAt"
            value={form.scheduledAt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Items</h2>
            <button type="button" className="text-brand-300 text-sm" onClick={addItem}>+ Add item</button>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <input
                className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                placeholder="Item name"
                value={item.name}
                onChange={(event) => handleItemChange(index, 'name', event.target.value)}
                required
              />
              <input
                className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                placeholder="Item cover photo URL"
                value={item.coverPhotoUrl}
                onChange={(event) => handleItemChange(index, 'coverPhotoUrl', event.target.value)}
                required
              />
              <input
                className="rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                placeholder="Unit price (cents)"
                type="number"
                value={item.unitPrice}
                onChange={(event) => handleItemChange(index, 'unitPrice', event.target.value)}
                required
              />
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
                  placeholder="Stock"
                  type="number"
                  value={item.stockQuantity}
                  onChange={(event) => handleItemChange(index, 'stockQuantity', event.target.value)}
                  required
                />
                {items.length > 1 && (
                  <button type="button" className="text-rose-300" onClick={() => removeItem(index)}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="bg-brand-500 hover:bg-brand-400 transition text-white font-semibold px-4 py-2 rounded-lg" disabled={loading}>
          {loading ? 'Creating...' : 'Create event'}
        </button>
      </form>
    </AppLayout>
  );
}
