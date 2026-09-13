"use client";

import {
  useEffect,
  useState,
} from "react";

import { BarChart3 } from "lucide-react";

import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import { getLandlordAnalytics } from "@/lib/analytics";
import { LandlordAnalyticsResponse } from "@/types/analytics";

export default function LandlordAnalyticsPage() {
  const [data, setData] =
    useState<LandlordAnalyticsResponse | null>(
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
        await getLandlordAnalytics();

      setData(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your analytics"
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
            See how tenants are interacting
            with your properties.
          </p>
        </div>

        {loading ? (
          <p className="mt-8 text-gray-500">
            Loading your analytics...
          </p>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="Couldn't load your analytics"
              description="We had trouble loading your analytics. Check your connection and try again."
              onRetry={loadAnalytics}
            />
          </div>
        ) : !data ||
          data.listings.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={BarChart3}
              title="No analytics yet"
              description="Once you add a property and tenants start viewing it, your analytics will show up here."
              actionLabel="Add Property"
              actionHref="/landlord/listings/new"
            />
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Total Views
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.total_views}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Favorites
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.total_favorites}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Messages Received
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    data.total_messages_received
                  }
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Availability
                  Confirmations
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    data.total_availability_confirmations
                  }
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Conversion Rate
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {data.conversion_rate}%
                </p>
              </div>
            </section>

            <div className="mt-10">
              <h2 className="text-xl font-semibold">
                By Property
              </h2>

              <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-500">
                      <th className="px-4 py-3 font-medium">
                        Property
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Views
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Favorites
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Messages
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Confirmations
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Conversion
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.listings.map(
                      (listing) => (
                        <tr
                          key={
                            listing.id
                          }
                          className="border-b last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {
                              listing.title
                            }
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {
                              listing.views_count
                            }
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {
                              listing.favorites_count
                            }
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {
                              listing.messages_received
                            }
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {
                              listing.availability_confirmations_count
                            }
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {
                              listing.conversion_rate
                            }
                            %
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
