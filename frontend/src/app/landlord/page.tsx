"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Building2,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import LandlordListingCard from "@/components/LandlordListingCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import { useAuth } from "@/context/AuthContext";

import {
  confirmListingAvailability,
  deleteListing,
  getMyListings,
  markListingAsRented,
} from "@/lib/landlordListings";

import { Listing } from "@/types/listing";

export default function LandlordPage() {
  const { user } = useAuth();

  const [listings, setListings] =
    useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [
    availabilityUpdatingId,
    setAvailabilityUpdatingId,
  ] = useState<number | null>(null);

  async function loadListings() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyListings();

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
    loadListings();
  }, []);

  async function handleDelete(
    id: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteListing(id);

      setListings(
        (currentListings) =>
          currentListings.filter(
            (listing) =>
              listing.id !== id
          )
      );

      toast.success(
        "Property deleted successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete listing"
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleConfirmAvailability(
    listingId: number
  ) {
    try {
      setAvailabilityUpdatingId(
        listingId
      );

      const updated =
        await confirmListingAvailability(
          listingId
        );

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId
            ? updated
            : listing
        )
      );

      toast.success(
        updated.is_available
          ? "Property marked as available"
          : "Availability confirmed"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to confirm availability"
      );
    } finally {
      setAvailabilityUpdatingId(
        null
      );
    }
  }

  async function handleMarkRented(
    listingId: number
  ) {
    const confirmed = window.confirm(
      "Mark this property as rented?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setAvailabilityUpdatingId(
        listingId
      );

      const updated =
        await markListingAsRented(
          listingId
        );

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId
            ? updated
            : listing
        )
      );

      toast.success(
        "Property marked as rented"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to mark property as rented"
      );
    } finally {
      setAvailabilityUpdatingId(
        null
      );
    }
  }

  const approvedListings =
    listings.filter(
      (listing) =>
        (listing.approval_status ??
          (listing.is_approved
            ? "approved"
            : "pending")) ===
        "approved"
    ).length;

  const pendingListings =
    listings.filter(
      (listing) =>
        (listing.approval_status ??
          (listing.is_approved
            ? "approved"
            : "pending")) ===
        "pending"
    ).length;

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
              {user?.full_name
                ? `, ${user.full_name}`
                : ""}
              !
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your properties and
              listings.
            </p>
          </div>

          <Link
            href="/landlord/listings/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-green-800 px-5 py-3 font-medium text-white hover:bg-green-900"
          >
            <Plus className="h-5 w-5" />
            Add New Property
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">
              Total Listings
            </p>

            <p className="mt-2 text-3xl font-bold">
              {listings.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold">
              {approvedListings}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">
              Pending Approval
            </p>

            <p className="mt-2 text-3xl font-bold">
              {pendingListings}
            </p>
          </div>
        </section>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">
            Your Properties
          </h2>

          {loading ? (
            <p className="mt-8 text-gray-500">
              Loading your properties...
            </p>
          ) : error ? (
            <div className="mt-10">
              <ErrorState
                title="Couldn't load your properties"
                description="We had trouble loading your listings. Check your connection and try again."
                onRetry={loadListings}
              />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={Building2}
                title="No properties yet"
                description="Create your first rental listing to start receiving enquiries from tenants."
                actionLabel="Add Property"
                actionHref="/landlord/listings/new"
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map(
                (listing) => (
                  <LandlordListingCard
                    key={listing.id}
                    listing={listing}
                    deleting={
                      deletingId ===
                      listing.id
                    }
                    onDelete={
                      handleDelete
                    }
                    onConfirmAvailability={
                      handleConfirmAvailability
                    }
                    onMarkRented={
                      handleMarkRented
                    }
                    availabilityUpdating={
                      availabilityUpdatingId ===
                      listing.id
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}