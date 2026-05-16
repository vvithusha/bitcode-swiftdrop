import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`;

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink to="/events" className="text-lg font-semibold text-white">
              SwiftDrop
            </NavLink>
            <nav className="hidden md:flex items-center gap-4">
              <NavLink to="/events" className={navLinkClass}>Events</NavLink>
              <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin/events" className="text-xs uppercase tracking-wide text-brand-300 border border-brand-500/40 px-3 py-1 rounded-full">
                Admin
              </NavLink>
            )}
            {user ? (
              <button
                onClick={logout}
                className="text-sm text-slate-300 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="text-sm text-slate-300 hover:text-white">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
