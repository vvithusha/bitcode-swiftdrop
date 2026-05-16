import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { deactivateUser, fetchUsers } from '../../api/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = () => {
    setLoading(true);
    fetchUsers()
      .then((res) => setUsers(res.data?.data?.users || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeactivate = async (userId) => {
    try {
      await deactivateUser(userId);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to deactivate user');
    }
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {loading && <p className="text-slate-400">Loading users...</p>}
      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{user.displayName}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
            <button
              className="text-sm text-rose-300"
              disabled={!user.isActive}
              onClick={() => handleDeactivate(user.id)}
            >
              {user.isActive ? 'Deactivate' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
