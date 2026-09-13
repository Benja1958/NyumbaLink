"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

import { getAdminAnalytics } from "@/lib/analytics";
import { AdminAnalyticsResponse } from "@/types/analytics";

export default function AdminAnalyticsPage() {
  const [data, setData] =
    useState<AdminAnalyticsResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getAdminAnalytics();

      setData(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics
          </h1>

          <p className="mt-2 text-gray-600">
            Platform-wide activity and
            moderation metrics.
          </p>
        </div>

        {loading ? (
          <p className="mt-8 text-gray-500">
            Loading analytics...
          </p>
        ) : error || !data ? (
          <div className="mt-10">
            <ErrorState
              title="Couldn't load analytics"
              description="We had trouble loading platform analytics. Check your connection and try again."
              onRetry={loadAnalytics}
            />
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Active Users
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.active_users}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Last 30 days
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Listings Created
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.listings_created}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Pending Approvals
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.pending_approvals}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Suspended Listings
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.suspended_listings}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Reports Received
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.reports_received}
                </p>
              </div>
            </section>

            <div className="mt-10">
              <h2 className="text-xl font-semibold">
                Reports by Status
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                  {
                    data.reports_breakdown
                      .pending
                  }{" "}
                  pending
                </span>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  {
                    data.reports_breakdown
                      .dismissed
                  }{" "}
                  dismissed
                </span>

                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                  {
                    data.reports_breakdown
                      .action_taken
                  }{" "}
                  action taken
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
