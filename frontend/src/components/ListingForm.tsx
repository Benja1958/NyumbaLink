"use client";

import { FormEvent, useState } from "react";

import { ListingPayload } from "@/lib/landlordListings";

type ListingFormProps = {
  initialValues?: Partial<ListingPayload>;
  submitLabel: string;

  onSubmit: (
    payload: ListingPayload
  ) => Promise<void>;
};

export default function ListingForm({
  initialValues,
  submitLabel,
  onSubmit,
}: ListingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const amenitiesText =
      formData.get("amenities")?.toString() ?? "";

    const amenities = amenitiesText
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean);
    
    const isAvailable =
        formData.get("is_available") === "on";

    const payload: ListingPayload = {
    title:
        formData.get("title")?.toString() ?? "",

    description:
        formData.get("description")?.toString() ?? "",

    location:
        formData.get("location")?.toString() ?? "",

    monthly_rent: Number(
        formData.get("monthly_rent")
    ),

    bedrooms: Number(
        formData.get("bedrooms")
    ),

    bathrooms: Number(
        formData.get("bathrooms")
    ),

    image_url:
        formData.get("image_url")?.toString() ?? "",

    amenities,

    is_available: isAvailable,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <div>
        <label className="mb-2 block text-sm font-medium">
          Property Title
        </label>

        <input
          name="title"
          required
          defaultValue={initialValues?.title ?? ""}
          placeholder="Modern 2-bedroom apartment"
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          required
          defaultValue={initialValues?.description ?? ""}
          placeholder="Describe the property..."
          className="h-36 w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Location
        </label>

        <input
          name="location"
          required
          defaultValue={initialValues?.location ?? ""}
          placeholder="Kilimani, Nairobi"
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Monthly Rent
          </label>

          <input
            name="monthly_rent"
            type="number"
            min="0"
            required
            defaultValue={
              initialValues?.monthly_rent ?? ""
            }
            placeholder="45000"
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Bedrooms
          </label>

          <input
            name="bedrooms"
            type="number"
            min="0"
            required
            defaultValue={
              initialValues?.bedrooms ?? ""
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Bathrooms
          </label>

          <input
            name="bathrooms"
            type="number"
            min="0"
            required
            defaultValue={
              initialValues?.bathrooms ?? ""
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Image URL
        </label>

        <input
          name="image_url"
          type="url"
          required
          defaultValue={initialValues?.image_url ?? ""}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        <p className="mt-2 text-xs text-gray-500">
          We&apos;ll replace this with proper image uploads later.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Amenities
        </label>

        <input
          name="amenities"
          defaultValue={
            initialValues?.amenities?.join(", ") ?? ""
          }
          placeholder="Parking, WiFi, Security, Balcony"
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        <p className="mt-2 text-xs text-gray-500">
          Separate amenities with commas.
        </p>
      </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
      <div>
        <p className="font-medium text-gray-900">
          Property Availability
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Turn this off if the property is no longer available for rent.
        </p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          name="is_available"
          defaultChecked={
            initialValues?.is_available ?? true
          }
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-700">
          <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-800 py-3 font-semibold text-white hover:bg-green-900 disabled:opacity-50"
      >
        {loading ? "Saving..." : submitLabel}
      </button>

    </form>
  );
}