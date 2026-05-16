import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { fetchEvent } from '../api/marketplace';
import { purchaseItem } from '../api/purchase';
import { socket } from '../socket/client';
import { useCountdown } from '../hooks/useCountdown';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchEvent(id)
      .then((res) => {
        if (mounted) {
          setEvent(res.data?.data?.event || null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.response?.data?.message || 'Unable to load event');
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
  }, [id]);

  useEffect(() => {
    if (!event) return;

    const handleStockUpdate = (payload) => {
      setEvent((prev) => {
        if (!prev) return prev;
        const updatedItems = prev.items?.map((item) =>
          item.id === payload.itemId ? { ...item, liveStock: payload.stock } : item
        );
        return { ...prev, items: updatedItems };
      });
    };

    const handleStatusChange = (payload) => {
      if (payload.eventId !== event.id) return;
      setEvent((prev) => (prev ? { ...prev, status: payload.status } : prev));
    };

    socket.on('stockUpdate', handleStockUpdate);
    socket.on('eventStatusChange', handleStatusChange);

    return () => {
      socket.off('stockUpdate', handleStockUpdate);
      socket.off('eventStatusChange', handleStatusChange);
    };
  }, [event]);

  const countdown = useCountdown(event?.scheduledAt || new Date().toISOString());
  const countdownLabel = countdown.total > 0
    ? `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
    : 'Live now';

  const isLive = event?.status === 'LIVE';

  const handleBuy = async (itemId) => {
    setBuyingId(itemId);
    try {
      const res = await purchaseItem(itemId);
      const orderId = res.data?.data?.order?.id;
      if (orderId) {
        navigate(`/purchase/${orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to purchase');
    } finally {
      setBuyingId(null);
    }
  };

  const items = useMemo(() => event?.items || [], [event]);

  return (
    <AppLayout>
      {loading && <p className="text-slate-400">Loading event...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      {event && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800">
            <img src={event.coverPhotoUrl} alt={event.name} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h1 className="text-3xl font-semibold">{event.name}</h1>
              <p className="text-slate-300">Starts: {new Date(event.scheduledAt).toLocaleString()}</p>
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/80 border border-slate-700 px-3 py-1 rounded-full text-xs">
              {isLive ? 'LIVE' : `Starts in ${countdownLabel}`}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-brand-300 text-sm">{formatCurrency(item.unitPrice)}</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Stock: {item.liveStock ?? item.stockQuantity}
                </p>
                <button
                  className="mt-4 w-full bg-brand-500 hover:bg-brand-400 transition text-white font-semibold py-2 rounded-lg disabled:opacity-60"
                  disabled={!isLive || buyingId === item.id || (item.liveStock ?? item.stockQuantity) <= 0}
                  onClick={() => handleBuy(item.id)}
                >
                  {buyingId === item.id ? 'Processing...' : isLive ? 'Buy now' : 'Not live'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
