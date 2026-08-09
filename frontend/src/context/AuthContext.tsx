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
  User,
} from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    token: string,
    user: User
  ) => void;
  logout: () => void;
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

  useEffect(() => {
    async function loadUser() {
      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

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
        const currentUser =
          await getCurrentUser(token);

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "UNAUTHORIZED"
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
            "Unable to verify session:",
            error
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  function login(
    token: string,
    user: User
  ) {
    localStorage.setItem(
      "access_token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);
  }

  function logout() {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
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