import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { fetchProfile, updateProfile } from '../api/profile';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchProfile()
      .then((res) => {
        const user = res.data?.data?.user;
        if (mounted) {
          setProfile(user);
          setDisplayName(user?.displayName || '');
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.response?.data?.message || 'Unable to load profile');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await updateProfile({ displayName });
      setProfile(res.data?.data?.user || null);
      setMessage('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      {loading && <p className="text-slate-400">Loading profile...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      {profile && (
        <div className="max-w-xl bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-slate-400 text-sm">Update your display name.</p>
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <div className="mt-1 text-slate-200">{profile.email}</div>
          </div>
          <div>
            <label className="text-sm text-slate-300">Display name</label>
            <input
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </div>
          {message && <div className="text-sm text-emerald-300">{message}</div>}
          <button
            className="bg-brand-500 hover:bg-brand-400 transition text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}
    </AppLayout>
  );
}
