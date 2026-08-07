"use client";

import { Heart } from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "@/lib/favorites";

type FavoriteButtonProps = {
  listingId: number;
};

export default function FavoriteButton({
  listingId,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const status =
          await getFavoriteStatus(
            listingId
          );

        setIsFavorited(status);
      } catch {
        // Could be logged out or request failed.
        setIsFavorited(false);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [listingId]);

  async function handleClick() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      if (isFavorited) {
        await removeFavorite(
          listingId
        );

        setIsFavorited(false);

        toast.success(
          "Removed from favorites"
        );
      } else {
        await addFavorite(
          listingId
        );

        setIsFavorited(true);

        toast.success(
          "Added to favorites"
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update favorites"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-full bg-white p-2 shadow disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={
        isFavorited
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      <Heart
        className={
          isFavorited
            ? "h-5 w-5 fill-red-500 text-red-500"
            : "h-5 w-5"
        }
      />
    </button>
  );
}