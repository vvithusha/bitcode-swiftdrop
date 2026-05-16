import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <Link className="text-brand-400 text-sm hover:text-brand-300" to="/events">
              SwiftDrop
            </Link>
          </div>
          <p className="text-slate-400 mt-2">{subtitle}</p>
        </div>
        {children}
        {footer && <div className="mt-6 text-sm text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}
