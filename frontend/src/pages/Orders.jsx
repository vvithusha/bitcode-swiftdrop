import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { fetchOrders } from '../api/profile';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchOrders()
      .then((res) => {
        if (mounted) setOrders(res.data?.data?.orders || []);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Unable to load orders');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Order history</h1>
      {loading && <p className="text-slate-400">Loading orders...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{order.event?.name}</p>
                <p className="text-sm text-slate-400">{order.item?.name}</p>
              </div>
              <div className="text-sm text-slate-300">{order.status}</div>
            </div>
            <div className="text-sm text-slate-400 mt-2">Paid: {formatCurrency(order.pricePaid)}</div>
          </div>
        ))}
        {!loading && orders.length === 0 && <p className="text-slate-400">No orders yet.</p>}
      </div>
    </AppLayout>
  );
}
