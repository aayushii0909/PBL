import { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  getStoredUser,
  setStoredUser,
  clearSession,
  getCurrentUser,
  logoutUser as apiLogout,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      const stored = getStoredUser();

      if (!token) {
        setUser(null);
        setReady(true);
        return;
      }

      // Show stored user immediately, then verify with backend
      if (stored) setUser(stored);

      const result = await getCurrentUser();
      if (result.success && result.data?.user) {
        setStoredUser(result.data.user);
        setUser(result.data.user);
      } else {
        clearSession();
        setUser(null);
      }
      setReady(true);
    };

    restoreSession();
  }, []);

  const login = (sessionUser) => {
    setStoredUser(sessionUser);
    setUser(sessionUser);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const updateSession = (sessionUser) => {
    setStoredUser(sessionUser);
    setUser(sessionUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, ready, login, logout, updateSession, isAuthenticated: !!user && !!getToken() }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
