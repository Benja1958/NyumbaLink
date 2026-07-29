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

import { getListing } from "@/lib/api";

import {
  ListingPayload,
  updateListing,
} from "@/lib/landlordListings";

import { Listing } from "@/types/listing";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  const listingId = Number(params.id);

  const [listing, setListing] =
    useState<Listing | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadListing() {
      try {
        const data = await getListing(listingId);

        setListing(data);
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
    payload: ListingPayload
  ) {
    await updateListing(
      listingId,
      payload
    );

    router.push("/landlord");
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">

        <Link
          href="/landlord"
          className="text-sm text-gray-600"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Edit Property
        </h1>

        {loading ? (
          <p className="mt-8">
            Loading property...
          </p>
        ) : error ? (
          <p className="mt-8 text-red-600">
            {error}
          </p>
        ) : listing ? (

          <div className="mt-8 rounded-xl border bg-white p-6">

            <ListingForm
              initialValues={{
                title: listing.title,
                description: listing.description,
                location: listing.location,
                monthly_rent:
                  listing.monthly_rent,
                bedrooms:
                  listing.bedrooms,
                bathrooms:
                  listing.bathrooms,
                image_url:
                  listing.image_url,
                amenities:
                  listing.amenities,
                is_available: 
                  listing.is_available,
              }}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
            />

          </div>

        ) : null}

      </main>
    </>
  );
}