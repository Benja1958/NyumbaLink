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
import AdminVerifiedPropertyCard from "@/components/AdminVerifiedPropertyCard";
import EmptyState from "@/components/EmptyState";

import {
  approveListing,
  getAllAdminListings,
  getPendingListings,
  rejectListing,
  unverifyProperty,
  verifyProperty,
} from "@/lib/admin";

import { Listing } from "@/types/listing";

export default function AdminPage() {
  const [
    pendingListings,
    setPendingListings,
  ] = useState<Listing[]>([]);

  const [
    approvedListings,
    setApprovedListings,
  ] = useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    processingId,
    setProcessingId,
  ] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const [
          pending,
          allListings,
        ] = await Promise.all([
          getPendingListings(),
          getAllAdminListings(),
        ]);

        setPendingListings(
          pending
        );

        setApprovedListings(
          allListings.filter(
            (listing) =>
              listing.approval_status ===
              "approved"
          )
        );
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

    loadListings();
  }, []);


  async function handleApprove(
    listingId: number
  ) {
    try {
      setProcessingId(
        listingId
      );

      const approved =
        await approveListing(
          listingId
        );

      setPendingListings(
        (current) =>
          current.filter(
            (listing) =>
              listing.id !==
              listingId
          )
      );

      setApprovedListings(
        (current) => [
          approved,
          ...current,
        ]
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
    const reason =
      window.prompt(
        "Why are you rejecting this listing?"
      );

    if (reason === null) {
      return;
    }

    const trimmedReason =
      reason.trim();

    if (
      trimmedReason.length < 5
    ) {
      toast.error(
        "Please provide a rejection reason of at least 5 characters."
      );

      return;
    }

    try {
      setProcessingId(
        listingId
      );

      await rejectListing(
        listingId,
        trimmedReason
      );

      setPendingListings(
        (current) =>
          current.filter(
            (listing) =>
              listing.id !==
              listingId
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


  async function handleVerifyProperty(
    listingId: number
  ) {
    try {
      setProcessingId(
        listingId
      );

      const updated =
        await verifyProperty(
          listingId
        );

      setApprovedListings(
        (current) =>
          current.map(
            (listing) =>
              listing.id ===
              listingId
                ? updated
                : listing
          )
      );

      toast.success(
        "Property verified"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to verify property"
      );
    } finally {
      setProcessingId(null);
    }
  }


  async function handleUnverifyProperty(
    listingId: number
  ) {
    try {
      setProcessingId(
        listingId
      );

      const updated =
        await unverifyProperty(
          listingId
        );

      setApprovedListings(
        (current) =>
          current.map(
            (listing) =>
              listing.id ===
              listingId
                ? updated
                : listing
          )
      );

      toast.success(
        "Property verification removed"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove property verification"
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
            Review listings and manage
            property verification.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Pending Listings
            </h2>

            {!loading && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
                {
                  pendingListings.length
                }{" "}
                pending
              </span>
            )}
          </div>

          {loading ? (
            <p className="mt-8 text-gray-500">
              Loading listings...
            </p>
          ) : pendingListings.length ===
            0 ? (
            <div className="mt-10">
              <EmptyState
                icon={
                  ClipboardCheck
                }
                title="No pending listings"
                description="All submitted properties have been reviewed. New listings awaiting approval will appear here."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pendingListings.map(
                (listing) => (
                  <AdminListingCard
                    key={
                      listing.id
                    }
                    listing={
                      listing
                    }
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

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Approved Properties
            </h2>

            {!loading && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {
                  approvedListings.length
                }{" "}
                approved
              </span>
            )}
          </div>

          {loading ? (
            <p className="mt-8 text-gray-500">
              Loading approved
              properties...
            </p>
          ) : approvedListings.length ===
            0 ? (
            <div className="mt-10">
              <EmptyState
                icon={
                  ClipboardCheck
                }
                title="No approved properties"
                description="Approved listings will appear here for property verification."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {approvedListings.map(
                (listing) => (
                  <AdminVerifiedPropertyCard
                    key={
                      listing.id
                    }
                    listing={
                      listing
                    }
                    processing={
                      processingId ===
                      listing.id
                    }
                    onVerify={
                      handleVerifyProperty
                    }
                    onUnverify={
                      handleUnverifyProperty
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