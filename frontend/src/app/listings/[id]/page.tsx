import Link from "next/link";
import { Bath, Bed, CheckCircle2, Heart, MapPin, Send } from "lucide-react";

import { getListing } from "@/lib/api";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;

  const property = await getListing(Number(id));
  const approvalStatus =
    property.approval_status ?? (property.is_approved ? "approved" : "pending");

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link
        href="/tenant"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to listings
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <img
            src={property.image_url}
            alt={property.title}
            className="h-[420px] w-full rounded-2xl object-cover"
          />

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>

                {approvalStatus === "approved" && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                {property.location}
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-gray-200 p-3 hover:bg-gray-50"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6">
            <div>
              <span className="text-3xl font-bold text-indigo-600">
                KES {property.monthly_rent.toLocaleString()}
              </span>
              <span className="text-gray-500">/month</span>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Bed className="h-5 w-5" />
                {property.bedrooms} Bedrooms
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Bath className="h-5 w-5" />
                {property.bathrooms} Bathrooms
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Description</h2>

            <p className="mt-4 leading-7 text-gray-600">
              {property.description}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Amenities</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </section>

        <aside>
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">
              Interested in this property?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Contact the landlord to ask questions or arrange a viewing.
            </p>

            <textarea
              placeholder="Hi, I'm interested in this property..."
              className="mt-6 h-28 w-full resize-none rounded-lg border border-gray-300 p-3"
            />

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 py-3 font-medium text-white"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
