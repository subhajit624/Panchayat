import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

const TOKEN_KEY = "smartPanchayatToken";

export const dashboardPathFor = (user) => {
  if (!user) return "/login";
  if (user.role === "admin") return "/admin";
  if (user.role === "worker") {
    return user.workerApprovalStatus === "approved" ? "/worker" : "/worker/pending";
  }
  return "/citizen";
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    connectSocket(nextToken);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    disconnectSocket();
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        if (mounted) {
          setUser(data.user);
          connectSocket(token);
        }
      } catch {
        clearAuth();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const listener = () => clearAuth();
    window.addEventListener("smart-panchayat:logout", listener);
    return () => window.removeEventListener("smart-panchayat:logout", listener);
  }, []);

  const login = async ({ phoneNumber, password, role }) => {
    const endpoint = role === "admin" ? "/auth/admin/login" : "/auth/login";
    const { data } = await api.post(endpoint, { phoneNumber, password, role });
    persistAuth(data.token, data.user);
    return data.user;
  };

  const registerCitizen = async (formData) => {
    const { data } = await api.post("/auth/register/citizen", formData);
    persistAuth(data.token, data.user);
    return data.user;
  };

  const registerWorker = async (formData) => {
    const { data } = await api.post("/auth/register/worker", formData);
    persistAuth(data.token, data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      if (token) await api.post("/auth/logout");
    } finally {
      clearAuth();
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      registerCitizen,
      registerWorker,
      setUser,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
