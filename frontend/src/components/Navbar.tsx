"use client";

import Link from "next/link";
import {
  Heart,
  House,
  MessageSquare,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

export default function Navbar() {
  const {
    user,
    loading,
    isAuthenticated,
    logout,
  } = useAuth();

  const messagingEnabled =
    isAuthenticated &&
    !!user &&
    (
      user.role === "tenant" ||
      user.role === "landlord"
    );

  const {
    unreadCount,
  } = useUnreadMessages({
    enabled: messagingEnabled,
  });

  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.push("/");
    }
  }

  const homeHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "landlord"
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

              {user.role === "admin" && (
                <>
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-700 hover:text-gray-950"
                  >
                    Listings
                  </Link>

                  <Link
                    href="/admin/reports"
                    className="text-sm font-medium text-gray-700 hover:text-gray-950"
                  >
                    Reports
                  </Link>
                </>
              )}

              {(user.role === "tenant" ||
                user.role === "landlord") && (
                <div className="flex items-center gap-2">
                  <Link
                    href={
                      user.role === "tenant"
                        ? "/tenant/messages"
                        : "/landlord/messages"
                    }
                    className="relative flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-950"
                  >
                    <span className="relative">
                      <MessageSquare className="h-5 w-5" />

                      {unreadCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                          {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                        </span>
                      )}
                    </span>

                    Messages
                  </Link>
                </div>
              )}

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
