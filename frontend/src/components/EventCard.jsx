import { Link } from 'react-router-dom';
import Badge from './Badge';
import { useCountdown } from '../hooks/useCountdown';

const formatCurrency = (value) => {
  if (value == null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value / 100);
};

export default function EventCard({ event }) {
  const countdown = useCountdown(event.scheduledAt);
  const cheapest = event.items?.reduce((min, item) => (item.unitPrice < min ? item.unitPrice : min), event.items?.[0]?.unitPrice ?? 0);

  const countdownLabel = countdown.total > 0
    ? `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
    : 'Live now';

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="h-40 bg-slate-800">
        <img src={event.coverPhotoUrl} alt={event.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{event.name}</h3>
          <Badge status={event.status} />
        </div>
        <p className="text-slate-400 text-sm">Starts: {new Date(event.scheduledAt).toLocaleString()}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">From {formatCurrency(cheapest)}</div>
          <div className="text-xs text-brand-300">{countdownLabel}</div>
        </div>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center justify-center w-full bg-brand-500 hover:bg-brand-400 transition text-white font-semibold rounded-lg py-2"
        >
          View Drop
        </Link>
      </div>
    </div>
  );
}
