"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  logoutUser,
  User,
} from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    try {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);

      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "UNAUTHORIZED"
      ) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user"
        );

        setUser(null);
      } else {
        console.error(
          "Unable to refresh user:",
          error
        );
      }

      throw error;
    }
  }

  useEffect(() => {
    async function loadUser() {
      const cachedUser =
        localStorage.getItem("user");

      if (cachedUser) {
        try {
          setUser(
            JSON.parse(cachedUser)
          );
        } catch {
          localStorage.removeItem(
            "user"
          );
        }
      }

      try {
        await refreshUser();
      } catch {
        // refreshUser already handles
        // authentication/session cleanup.
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  function login(user: User) {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.removeItem(
      "access_token"
    );

    setUser(user);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}