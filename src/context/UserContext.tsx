// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  role: number;
  nama: string;
  email: string;
  kd_unit: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  initializing: boolean; // true saat kita sedang validasi /auth/me
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(null);
  const [initializing, setInitializing] = useState(true);
  // const router = useRouter();

  // helper: set user both in state and sessionStorage
  const setUser = (u: User) => {
    try {
      if (u) sessionStorage.setItem("user", JSON.stringify(u));
      else sessionStorage.removeItem("user");
    } catch {
      // ignore storage errors
    }
    setUserState(u);
  };

  const clearUser = () => {
    try {
      sessionStorage.removeItem("user");
    } catch {}
    setUserState(null);
  };

  useEffect(() => {
    // 1) Quick restore from sessionStorage so UI is responsive
    try {
      const stored = sessionStorage.getItem("user");
      if (stored) {
        setUserState(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error reading sessionStorage user:", err);
    }

    // 2) Always validate with backend /auth/me (will use httpOnly cookie)
    const validate = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // penting: kirim cookie
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setUserState(data);
          try {
            sessionStorage.setItem("user", JSON.stringify(data));
          } catch {}
        } else {
          // token invalid/expired -> clear user
          clearUser();
        }
      } catch (err) {
        console.error("Failed to validate /auth/me:", err);
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
