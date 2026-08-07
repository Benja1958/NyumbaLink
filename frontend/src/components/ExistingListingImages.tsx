"use client";

import { useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

import ImageUploader from "@/components/ImageUploader";

import { ListingImage } from "@/types/listing";

import { toast } from "sonner";

import {
  deleteListingImage,
  setListingCoverImage,
  uploadListingImages,
} from "@/lib/listingImages";

type ExistingListingImagesProps = {
  listingId: number;
  images: ListingImage[];
  onImagesChange: (
    images: ListingImage[]
  ) => void;
};

export default function ExistingListingImages({
  listingId,
  images,
  onImagesChange,
}: ExistingListingImagesProps) {
  const [newFiles, setNewFiles] =
    useState<File[]>([]);

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const remainingSlots = Math.max(
    0,
    10 - images.length
  );

  async function handleUpload() {
    if (newFiles.length === 0) {
      setError(
        "Please select at least one photo"
      );
      return;
    }

    if (
      images.length + newFiles.length >
      10
    ) {
      setError(
        "A listing can have at most 10 images"
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedImages =
        await uploadListingImages(
          listingId,
          newFiles
        );

      onImagesChange([
        ...images,
        ...uploadedImages,
      ]);

      setNewFiles([]);
      toast.success(
      `${uploadedImages.length} photo${
        uploadedImages.length === 1
          ? ""
          : "s"
      } uploaded successfully`
    );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload images"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(
    imageId: number
  ) {
    const confirmed = window.confirm(
      "Delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(imageId);
      setError("");
      setSuccess("");

      await deleteListingImage(
        listingId,
        imageId
      );

      const deletedImage =
        images.find(
          (image) =>
            image.id === imageId
        );

      let updatedImages =
        images.filter(
          (image) =>
            image.id !== imageId
        );

      if (
        deletedImage?.is_cover &&
        updatedImages.length > 0
      ) {
        const firstRemaining =
          [...updatedImages].sort(
            (first, second) =>
              first.position -
              second.position
          )[0];

        updatedImages =
          updatedImages.map(
            (image) => ({
              ...image,
              is_cover:
                image.id ===
                firstRemaining.id,
            })
          );
      }

      onImagesChange(updatedImages);
      toast.success(
        "Photo deleted successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete image"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleSetCover(
    imageId: number
  ) {
    try {
      setProcessingId(imageId);
      setError("");
      setSuccess("");

      await setListingCoverImage(
        listingId,
        imageId
      );

      onImagesChange(
        images.map((image) => ({
          ...image,
          is_cover:
            image.id === imageId,
        }))
      );

      toast.success(
        "Cover photo updated"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to set cover image"
      );
    } finally {
      setProcessingId(null);
    }
  }

  const sortedImages = [...images].sort(
    (first, second) =>
      first.position -
      second.position
  );

  return (
    <section className="space-y-8">
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Current Photos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose a cover photo, remove photos,
            or upload additional images.
          </p>
        </div>

        {sortedImages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              No uploaded images yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedImages.map(
              (image) => {
                const processing =
                  processingId ===
                  image.id;

                return (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="relative">
                      <img
                        src={image.image_url}
                        alt="Property"
                        className="aspect-[4/3] w-full object-cover object-center"
                      />

                      {image.is_cover && (
                        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-green-800 px-3 py-1 text-xs font-medium text-white">
                          <Check className="h-3.5 w-3.5" />
                          Cover
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 p-3">
                      <button
                        type="button"
                        disabled={
                          processing ||
                          image.is_cover
                        }
                        onClick={() =>
                          handleSetCover(
                            image.id
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Star className="h-4 w-4" />

                        {image.is_cover
                          ? "Current Cover"
                          : "Set Cover"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          processing ||
                          images.length <= 1
                        }
                        onClick={() =>
                          handleDelete(
                            image.id
                          )
                        }
                        className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete image"
                        title={
                          images.length <= 1
                            ? "A listing must keep at least one image"
                            : "Delete image"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Upload More Photos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            You can add up to{" "}
            {remainingSlots} more{" "}
            {remainingSlots === 1
              ? "photo"
              : "photos"}.
          </p>
        </div>

        {remainingSlots > 0 ? (
          <>
            <ImageUploader
              files={newFiles}
              onChange={setNewFiles}
              maxImages={
                remainingSlots
              }
            />

            <button
              type="button"
              onClick={handleUpload}
              disabled={
                uploading ||
                newFiles.length === 0
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />

              {uploading
                ? "Uploading..."
                : `Upload ${
                    newFiles.length || ""
                  } ${
                    newFiles.length === 1
                      ? "Photo"
                      : "Photos"
                  }`}
            </button>
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 px-4 py-4 text-sm text-gray-600">
            This listing already has the maximum
            of 10 photos.
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-700">
          {success}
        </p>
      )}
    </section>
  );
}