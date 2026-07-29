"use client";

import Link from "next/link";
import {
  Heart,
  House,
  MessageSquare,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const {
    user,
    loading,
    isAuthenticated,
    logout,
  } = useAuth();

  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const homeHref =
    user?.role === "landlord"
      ? "/landlord"
      : "/tenant";

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href={isAuthenticated ? homeHref : "/"}
          className="flex items-center gap-2"
        >
          <House className="h-7 w-7 text-indigo-600" />

          <span className="text-2xl font-bold text-gray-900">
            NyumbaLink
          </span>
        </Link>

        <div className="flex items-center gap-4">

          {!loading && isAuthenticated && user ? (
            <>
              {user.role === "tenant" && (
                <Link
                  href="/tenant/favorites"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-950"
                >
                  <Heart className="h-4 w-4" />
                  Liked
                </Link>
              )}

              {user.role === "landlord" && (
                <Link
                  href="/landlord"
                  className="text-sm font-medium text-gray-700 hover:text-gray-950"
                >
                  My Properties
                </Link>
              )}

              <Link
                href={
                  user.role === "tenant"
                    ? "/tenant/messages"
                    : "/landlord/messages"
                }
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-950"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>

              <span className="text-sm text-gray-600">
                {user.full_name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-700 hover:text-gray-950"
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-950"
            >
              Login
            </Link>
          ) : null}

        </div>
      </nav>
    </header>
  );
}