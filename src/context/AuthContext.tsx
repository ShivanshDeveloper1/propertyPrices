"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me");
      
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          return;
        }
      }
      
      // If server returns 401 or authenticated is false
      setUser(null); 
    } catch (err) {
      console.error("Auth check failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);