"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import {
  FavoriteWithListing,
  getFavorites,
} from "@/lib/favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<
    FavoriteWithListing[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">
          Saved Properties
        </h1>

        <p className="mt-2 text-gray-600">
          Properties you've saved for later.
        </p>

        {loading ? (
          <p className="mt-8 text-gray-500">
            Loading favorites...
          </p>
        ) : favorites.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed p-10 text-center">
            <h2 className="font-semibold">
              No saved properties yet
            </h2>

            <p className="mt-2 text-gray-500">
              Tap the heart on a listing to save it.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <PropertyCard
                key={favorite.id}
                property={favorite.listing}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}