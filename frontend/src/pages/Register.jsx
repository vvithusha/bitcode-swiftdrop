import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', displayName: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SwiftDrop to access limited drops."
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Display name</label>
          <input
            className="w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            className="w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Password</label>
          <input
            className="w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg">
            {error}
          </div>
        )}
        <button
          className="w-full rounded-lg bg-brand-500 hover:bg-brand-400 transition text-white py-2 font-semibold disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
