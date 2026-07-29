"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Building2, Plus } from "lucide-react";

import Navbar from "@/components/Navbar";
import LandlordListingCard from "@/components/LandlordListingCard";

import { deleteListing, getMyListings } from "@/lib/landlordListings";

import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";

export default function LandlordPage() {
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await getMyListings();

        setListings(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load listings",
        );
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteListing(id);

      setListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== id),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete listing",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const approvedListings = listings.filter(
    (listing) =>
      (listing.approval_status ??
        (listing.is_approved ? "approved" : "pending")) === "approved",
  ).length;

  const pendingListings = listings.filter(
    (listing) =>
      (listing.approval_status ??
        (listing.is_approved ? "approved" : "pending")) === "pending",
  ).length;

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
              {user?.full_name ? `, ${user.full_name}` : ""}!
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your properties and listings.
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

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Total Listings</p>

            <p className="mt-2 text-3xl font-bold">{listings.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Approved</p>

            <p className="mt-2 text-3xl font-bold">{approvedListings}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Pending Approval</p>

            <p className="mt-2 text-3xl font-bold">{pendingListings}</p>
          </div>
        </section>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Your Properties</h2>

          {loading ? (
            <p className="mt-8 text-gray-500">Loading your properties...</p>
          ) : error ? (
            <p className="mt-8 text-red-600">{error}</p>
          ) : listings.length === 0 ? (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
              <Building2 className="h-12 w-12 text-gray-300" />

              <h3 className="mt-4 font-semibold">No properties listed yet</h3>

              <p className="mt-2 text-sm text-gray-500">
                Start by adding your first property.
              </p>

              <Link
                href="/landlord/listings/new"
                className="mt-5 flex items-center gap-2 rounded-lg bg-green-800 px-5 py-3 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Add Property
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <LandlordListingCard
                  key={listing.id}
                  listing={listing}
                  deleting={deletingId === listing.id}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
