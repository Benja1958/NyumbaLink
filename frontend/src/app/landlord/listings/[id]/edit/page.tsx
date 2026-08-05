"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Navbar from "@/components/Navbar";
import ListingForm from "@/components/ListingForm";
import ExistingListingImages from "@/components/ExistingListingImages";

import { getListing } from "@/lib/api";

import {
  ListingPayload,
  resubmitListing,
  updateListing,
} from "@/lib/landlordListings";

import {
  Listing,
  ListingImage,
} from "@/types/listing";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  const listingId = Number(params.id);

  const [listing, setListing] =
    useState<Listing | null>(null);

  const [images, setImages] =
    useState<ListingImage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [resubmitting, setResubmitting] =
    useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        const data =
          await getListing(listingId);

        setListing(data);
        setImages(data.images ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load listing"
        );
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [listingId]);

  async function handleUpdate(
    payload: ListingPayload,
    _newImages: File[]
  ) {
    await updateListing(
      listingId,
      payload
    );

    router.push("/landlord");
  }

  async function handleResubmit() {
    try {
      setResubmitting(true);
      setError("");

      const updated =
        await resubmitListing(listingId);

      setListing(updated);
      router.push("/landlord");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to resubmit listing"
      );
    } finally {
      setResubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/landlord"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Edit Property
        </h1>

        <p className="mt-2 text-gray-600">
          Update the property details and manage its photos.
        </p>

        {loading ? (
          <p className="mt-8 text-gray-500">
            Loading property...
          </p>
        ) : error && !listing ? (
          <p className="mt-8 text-red-600">
            {error}
          </p>
        ) : listing ? (
          <div className="mt-8 space-y-8">
            {listing.approval_status ===
              "rejected" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h2 className="font-semibold text-red-900">
                  Listing rejected
                </h2>

                <p className="mt-2 text-sm text-red-700">
                  {listing.rejection_reason ||
                    "No rejection reason was provided."}
                </p>

                <p className="mt-3 text-sm text-red-700">
                  Update the property details or photos, save your changes,
                  then resubmit the listing for review.
                </p>

                <button
                  type="button"
                  onClick={handleResubmit}
                  disabled={resubmitting}
                  className="mt-4 rounded-lg bg-red-700 px-5 py-3 font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resubmitting
                    ? "Resubmitting..."
                    : "Resubmit for Review"}
                </button>
              </div>
            )}

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <ExistingListingImages
              listingId={listing.id}
              images={images}
              onImagesChange={setImages}
            />

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <ListingForm
                initialValues={{
                  title: listing.title,
                  description:
                    listing.description ?? "",
                  location: listing.location,
                  monthly_rent:
                    listing.monthly_rent,
                  bedrooms:
                    listing.bedrooms,
                  bathrooms:
                    listing.bathrooms,
                  amenities:
                    listing.amenities ?? [],
                  is_available:
                    listing.is_available,
                }}
                submitLabel="Save Changes"
                onSubmit={handleUpdate}
              />
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}