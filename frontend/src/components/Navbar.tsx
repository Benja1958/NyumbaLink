"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Heart,
  House,
  LogOut,
  Menu,
  MessageSquare,
  UserRound,
  X,
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

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const headerRef =
    useRef<HTMLElement>(null);

  const menuButtonRef =
    useRef<HTMLButtonElement>(null);

  // Close the mobile menu on outside tap or Escape.
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    function handlePointerDown(
      event: PointerEvent
    ) {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node
        )
      ) {
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );
    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  async function handleLogout() {
    setMobileMenuOpen(false);

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
    <header
      ref={headerRef}
      className="relative border-b border-gray-200 bg-white"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link
          href={
            isAuthenticated
              ? homeHref
              : "/"
          }
          className="flex items-center gap-2"
        >
          <House className="h-6 w-6 text-indigo-600 md:h-7 md:w-7" />

          <span className="text-xl font-bold text-gray-900 md:text-2xl">
            KayaHub
          </span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {!loading &&
          isAuthenticated &&
          user ? (
            <>
              {user.role ===
                "tenant" && (
                <Link
                  href="/tenant/favorites"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-950"
                >
                  <Heart className="h-4 w-4" />
                  Liked
                </Link>
              )}

              {user.role ===
                "landlord" && (
                <Link
                  href="/landlord"
                  className="text-sm font-medium text-gray-700 hover:text-gray-950"
                >
                  My Properties
                </Link>
              )}

              {user.role ===
                "admin" && (
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

                  <Link
                    href="/admin/landlords"
                    className="text-sm font-medium text-gray-700 hover:text-gray-950"
                  >
                    Landlords
                  </Link>
                </>
              )}

              {(user.role ===
                "tenant" ||
                user.role ===
                  "landlord") && (
                <div className="flex items-center gap-2">
                  <Link
                    href={
                      user.role ===
                      "tenant"
                        ? "/tenant/messages"
                        : "/landlord/messages"
                    }
                    className="relative flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-950"
                  >
                    <span className="relative">
                      <MessageSquare className="h-5 w-5" />

                      {unreadCount >
                        0 && (
                        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                          {unreadCount >
                          99
                            ? "99+"
                            : unreadCount}
                        </span>
                      )}
                    </span>

                    Messages
                  </Link>
                </div>
              )}

             {user.role === "landlord" ? (
                <Link
                  href="/landlord/profile"
                  className="text-sm font-medium text-gray-700 hover:text-gray-950"
                >
                  {user.full_name}
                </Link>
              ) : (
                <span className="text-sm text-gray-600">
                  {user.full_name}
                </span>
              )}

              <button
                type="button"
                onClick={
                  handleLogout
                }
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

        <div className="md:hidden">
          {!loading &&
          isAuthenticated &&
          user ? (
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (open) => !open
                )
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : unreadCount > 0
                  ? `Open menu, ${unreadCount} unread messages`
                  : "Open menu"
              }
              className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-gray-900"
            >
              {mobileMenuOpen ? (
                <X
                  aria-hidden="true"
                  className="h-6 w-6"
                />
              ) : (
                <Menu
                  aria-hidden="true"
                  className="h-6 w-6"
                />
              )}

              {!mobileMenuOpen &&
                unreadCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white"
                  />
                )}
            </button>
          ) : !loading ? (
            <Link
              href="/login"
              className="flex min-h-11 items-center text-sm font-medium text-gray-700 hover:text-gray-950"
            >
              Login
            </Link>
          ) : null}
        </div>
      </nav>

      {mobileMenuOpen &&
        isAuthenticated &&
        user && (
          <div
            id="mobile-nav-menu"
            className="absolute inset-x-0 top-full z-40 border-b border-gray-200 bg-white shadow-lg md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-2">
              <div className="flex items-center gap-3 border-b border-gray-100 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                  <UserRound
                    aria-hidden="true"
                    className="h-5 w-5 text-indigo-600"
                  />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user.full_name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <ul className="py-1">
                {user.role ===
                  "tenant" && (
                  <li>
                    <Link
                      href="/tenant/favorites"
                      onClick={closeMobileMenu}
                      className={mobileItemClass}
                    >
                      <Heart
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500"
                      />
                      Liked
                    </Link>
                  </li>
                )}

                {user.role ===
                  "landlord" && (
                  <li>
                    <Link
                      href="/landlord"
                      onClick={closeMobileMenu}
                      className={mobileItemClass}
                    >
                      <House
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500"
                      />
                      My Properties
                    </Link>
                  </li>
                )}

                {user.role ===
                  "admin" && (
                  <>
                    <li>
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className={mobileItemClass}
                      >
                        Listings
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/admin/reports"
                        onClick={closeMobileMenu}
                        className={mobileItemClass}
                      >
                        Reports
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/admin/landlords"
                        onClick={closeMobileMenu}
                        className={mobileItemClass}
                      >
                        Landlords
                      </Link>
                    </li>
                  </>
                )}

                {messagingEnabled && (
                  <li>
                    <Link
                      href={
                        user.role ===
                        "tenant"
                          ? "/tenant/messages"
                          : "/landlord/messages"
                      }
                      onClick={closeMobileMenu}
                      className={mobileItemClass}
                    >
                      <MessageSquare
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500"
                      />
                      Messages

                      {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                          {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                          <span className="sr-only">
                            {" "}unread
                          </span>
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {user.role ===
                  "landlord" && (
                  <li>
                    <Link
                      href="/landlord/profile"
                      onClick={closeMobileMenu}
                      className={mobileItemClass}
                    >
                      <UserRound
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500"
                      />
                      My profile
                    </Link>
                  </li>
                )}

                <li className="mt-1 border-t border-gray-100 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${mobileItemClass} w-full`}
                  >
                    <LogOut
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-500"
                    />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
    </header>
  );
}

const mobileItemClass =
  "flex min-h-12 items-center gap-3 rounded-lg px-2 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-gray-900";
