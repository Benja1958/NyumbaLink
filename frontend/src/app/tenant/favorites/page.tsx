"use client";

import {
  useEffect,
  useState,
} from "react";

import { Heart } from "lucide-react";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import {
  FavoriteWithListing,
  getFavorites,
} from "@/lib/favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<
    FavoriteWithListing[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadFavorites() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getFavorites();

      setFavorites(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load saved properties"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Saved Properties
        </h1>

        <p className="mt-2 text-gray-600">
          Properties you&apos;ve saved for later.
        </p>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <PropertyCardSkeleton
                key={index}
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="Couldn't load saved properties"
              description="We had trouble loading your favorites. Check your connection and try again."
              onRetry={loadFavorites}
            />
          </div>
        ) : favorites.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Heart}
              title="No saved properties yet"
              description="Save properties you like while browsing and they'll appear here."
              actionLabel="Browse Properties"
              actionHref="/tenant"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map(
              (favorite) => (
                <PropertyCard
                  key={favorite.id}
                  property={
                    favorite.listing
                  }
                />
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}