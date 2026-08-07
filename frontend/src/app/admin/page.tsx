"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import AdminListingCard from "@/components/AdminListingCard";

import {
  approveListing,
  getPendingListings,
  rejectListing,
} from "@/lib/admin";

import { Listing } from "@/types/listing";

import { toast } from "sonner";

export default function AdminPage() {
  const [listings, setListings] =
    useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  useEffect(() => {
    async function loadPendingListings() {
      try {
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
      alert(
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
    const confirmed = window.confirm(
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
    } catch (error) {
      alert(
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

            {!loading && (
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

            <p className="mt-8 text-red-600">
              {error}
            </p>

          ) : listings.length === 0 ? (

            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-12 text-center">

              <h3 className="font-semibold">
                No listings waiting for review
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                New landlord listings will
                appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {listings.map((listing) => (
                <AdminListingCard
                  key={listing.id}
                  listing={listing}
                  processing={
                    processingId === listing.id
                  }
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}

            </div>

          )}

        </section>

      </main>
    </>
  );
}