import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, logoutUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((res) => {
        if (isMounted) {
          setUser(res.data?.data?.user || null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(payload) {
      const response = await loginUser(payload);
      setUser(response.data?.data?.user || null);
      return response;
    },
    async register(payload) {
      const response = await registerUser(payload);
      return response;
    },
    async logout() {
      await logoutUser();
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
