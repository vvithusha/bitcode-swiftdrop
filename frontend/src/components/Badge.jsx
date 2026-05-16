const styles = {
  LIVE: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  LOCKED: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  CLOSED: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  SOLD_OUT: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs border rounded-full ${styles[status] || styles.CLOSED}`}>
      {status}
    </span>
  );
}
