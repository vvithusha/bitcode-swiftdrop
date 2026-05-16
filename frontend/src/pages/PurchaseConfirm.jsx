import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { confirmOrder, cancelOrder } from '../api/purchase';
import { fetchOrders } from '../api/profile';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);

export default function PurchaseConfirm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchOrders()
      .then((res) => {
        if (mounted) {
          const orders = res.data?.data?.orders || [];
          setOrder(orders.find((item) => item.id === orderId) || null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.response?.data?.message || 'Unable to load order');
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
  }, [orderId]);

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      await confirmOrder(orderId);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to confirm');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelOrder(orderId);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppLayout>
      {loading && <p className="text-slate-400">Loading order...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      {order && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">Confirm purchase</h1>
          <div className="space-y-2 text-sm text-slate-300">
            <div>Event: {order.event?.name}</div>
            <div>Item: {order.item?.name}</div>
            <div>Price: {formatCurrency(order.pricePaid)}</div>
            <div>Status: {order.status}</div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              className="bg-emerald-500 hover:bg-emerald-400 transition text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
              disabled={actionLoading}
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              className="bg-rose-500 hover:bg-rose-400 transition text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
              disabled={actionLoading}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
