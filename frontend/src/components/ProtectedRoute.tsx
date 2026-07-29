"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRole?: "tenant" | "landlord" | "admin";
};

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (
      allowedRole &&
      user &&
      user.role !== allowedRole
    ) {
      if (user.role === "landlord") {
        router.replace("/landlord");
      } else {
        router.replace("/tenant");
      }
    }
  }, [
    loading,
    isAuthenticated,
    user,
    allowedRole,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Redirecting...
        </p>
      </div>
    );
  }

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Redirecting...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}