import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("cloudex_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("cloudex_token")
  );
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (token) localStorage.setItem("cloudex_token", token);
    else localStorage.removeItem("cloudex_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("cloudex_user", JSON.stringify(user));
    else localStorage.removeItem("cloudex_user");
  }, [user]);

  const persistSession = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const doLogin = async (email, password) => {
    setLoading(true);
    setAuthError("");
    try {
      const { data } = await api.login(email, password);
      persistSession(data);
      return { ok: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Couldn't sign in. Please try again.";
      setAuthError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  const doSignup = async (name, email, password) => {
    setLoading(true);
    setAuthError("");
    try {
      const { data } = await api.signup(name, email, password);
      persistSession(data);
      return { ok: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Couldn't create your account.";
      setAuthError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isAuthenticated: !!token,
        loading,
        authError,
        setAuthError,
        doLogin,
        doSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
