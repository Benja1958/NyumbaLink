"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardCheck,
} from "lucide-react";

import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import AdminListingCard from "@/components/AdminListingCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import {
  approveListing,
  getPendingListings,
  rejectListing,
} from "@/lib/admin";

import { Listing } from "@/types/listing";

export default function AdminPage() {
  const [listings, setListings] =
    useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  async function loadPendingListings() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPendingListings();

      setListings(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load listings"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingListings();
  }, []);

  async function handleApprove(
    listingId: number
  ) {
    try {
      setProcessingId(listingId);

      await approveListing(listingId);

      setListings((current) =>
        current.filter(
          (listing) =>
            listing.id !== listingId
        )
      );

      toast.success(
        "Listing approved"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to approve listing"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(
    listingId: number
  ) {
    const confirmed =
      window.confirm(
        "Reject this listing?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(listingId);

      await rejectListing(listingId);

      setListings((current) =>
        current.filter(
          (listing) =>
            listing.id !== listingId
        )
      );

      toast.success(
        "Listing rejected"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reject listing"
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Review landlord listings before
            they become visible to tenants.
          </p>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Pending Listings
            </h2>

            {!loading && !error && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
                {listings.length} pending
              </span>
            )}
          </div>

          {loading ? (
            <p className="mt-8 text-gray-500">
              Loading pending listings...
            </p>
          ) : error ? (
            <div className="mt-10">
              <ErrorState
                title="Couldn't load pending listings"
                description="We had trouble loading properties awaiting review. Check your connection and try again."
                onRetry={loadPendingListings}
              />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={ClipboardCheck}
                title="No pending listings"
                description="All submitted properties have been reviewed. New listings awaiting approval will appear here."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map(
                (listing) => (
                  <AdminListingCard
                    key={listing.id}
                    listing={listing}
                    processing={
                      processingId ===
                      listing.id
                    }
                    onApprove={
                      handleApprove
                    }
                    onReject={
                      handleReject
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}