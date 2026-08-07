"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ListingForm from "@/components/ListingForm";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

import {
  createListing,
  ListingPayload,
} from "@/lib/landlordListings";

import {
  uploadListingImages,
} from "@/lib/listingImages";

export default function NewListingPage() {
  const router = useRouter();

  async function handleCreate(
    payload: ListingPayload,
    images: File[]
  ) {
    const listing =
      await createListing(payload);

    await uploadListingImages(
      listing.id,
      images
    );
    toast.success(
      "Property created successfully"
    );

    router.push("/landlord");
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
          Add New Property
        </h1>

        <p className="mt-2 text-gray-600">
          Add the details tenants need to evaluate your property.
        </p>

        <div className="mt-8 rounded-xl border bg-white p-6">
          <ListingForm
            submitLabel="Create Listing"
            onSubmit={handleCreate}
            requireImages
          />
        </div>

      </main>
    </>
  );
}