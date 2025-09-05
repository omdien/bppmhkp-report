// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  role: number;
  nama: string;
  email: string;
  kd_unit: string;
  nama_unit?: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  initializing: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const setUser = (u: User | null) => {
    setUserState(u);
    try {
      if (u) sessionStorage.setItem("user", JSON.stringify(u));
      else sessionStorage.removeItem("user");
    } catch {}
  };

  const clearUser = () => setUser(null);

  useEffect(() => {
    // Restore cepat dari sessionStorage
    try {
      const stored = sessionStorage.getItem("user");
      if (stored) setUserState(JSON.parse(stored));
    } catch {}

    const validate = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { credentials: "include", cache: "no-store" }
        );
        if (res.ok) {
          const raw = await res.json();
          const normalized: User = {
            id: raw.USER_ID,
            username: raw.USERNAME,
            role: Number(raw.ROLE),
            nama: raw.NAMA,
            email: raw.EMAIL,
            kd_unit: raw.KD_UNIT,
            nama_unit: raw.upt?.NM_UNIT ?? null,
          };
          setUser(normalized);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      } finally {
        setInitializing(false);
      }
    };

    validate();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        initializing,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
