"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  X,
} from "lucide-react";

import { ListingImage } from "@/types/listing";

type PropertyImageGalleryProps = {
  images: ListingImage[];
  fallbackImage?: string | null;
  title: string;
};

export default function PropertyImageGallery({
  images,
  fallbackImage,
  title,
}: PropertyImageGalleryProps) {
  const imageUrls = useMemo(() => {
    const sortedImages = [...images].sort(
      (first, second) => {
        if (first.is_cover && !second.is_cover) {
          return -1;
        }

        if (!first.is_cover && second.is_cover) {
          return 1;
        }

        return first.position - second.position;
      }
    );

    if (sortedImages.length > 0) {
      return sortedImages.map(
        (image) => image.image_url
      );
    }

    return fallbackImage
      ? [fallbackImage]
      : [];
  }, [images, fallbackImage]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const showPrevious = useCallback(() => {
    setCurrentIndex((current) =>
      current === 0
        ? imageUrls.length - 1
        : current - 1
    );
  }, [imageUrls.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((current) =>
      current === imageUrls.length - 1
        ? 0
        : current + 1
    );
  }, [imageUrls.length]);

  useEffect(() => {
    if (currentIndex >= imageUrls.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, imageUrls.length]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (!isFullscreen) {
        return;
      }

      if (event.key === "Escape") {
        setIsFullscreen(false);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isFullscreen,
    showNext,
    showPrevious,
  ]);

  useEffect(() => {
    document.body.style.overflow =
      isFullscreen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (imageUrls.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gray-100">
        <div className="text-center text-gray-500">
          <Images className="mx-auto h-10 w-10 text-gray-300" />

          <p className="mt-3 text-sm">
            No property photos available
          </p>
        </div>
      </div>
    );
  }

  const currentImage =
    imageUrls[currentIndex];

  return (
    <>
      <section>
        <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
          <button
            type="button"
            onClick={() =>
              setIsFullscreen(true)
            }
            className="block w-full"
            aria-label="Open full-screen gallery"
          >
            <img
              src={currentImage}
              alt={`${title}, photo ${
                currentIndex + 1
              }`}
              className="aspect-[16/10] w-full object-cover object-center transition duration-300 group-hover:scale-[1.01]"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setIsFullscreen(true)
            }
            className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-white"
          >
            <Expand className="h-4 w-4" />
            View photos
          </button>

          {imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-gray-900 opacity-0 shadow transition hover:bg-white group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-gray-900 opacity-0 shadow transition hover:bg-white group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-sm font-medium text-white">
            {currentIndex + 1} of{" "}
            {imageUrls.length}
          </div>
        </div>

        {imageUrls.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {imageUrls.map(
              (imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`View image ${
                    index + 1
                  }`}
                  className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    currentIndex === index
                      ? "border-green-700"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${title}, thumbnail ${
                      index + 1
                    }`}
                    className="h-20 w-28 object-cover object-center"
                  />

                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Cover
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        )}
      </section>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
        >
          <div className="flex items-center justify-between px-6 py-4 text-white">
            <div>
              <p className="font-medium">
                {title}
              </p>

              <p className="mt-1 text-sm text-white/70">
                {currentIndex + 1} of{" "}
                {imageUrls.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsFullscreen(false)
              }
              aria-label="Close gallery"
              className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-16 pb-6">
            {imageUrls.length > 1 && (
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous image"
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            <img
              src={currentImage}
              alt={`${title}, full-screen photo ${
                currentIndex + 1
              }`}
              className="max-h-[78vh] max-w-full object-contain"
            />

            {imageUrls.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </div>

          {imageUrls.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-6 pb-5">
              {imageUrls.map(
                (imageUrl, index) => (
                  <button
                    key={`fullscreen-${imageUrl}-${index}`}
                    type="button"
                    onClick={() =>
                      setCurrentIndex(index)
                    }
                    className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      currentIndex === index
                        ? "border-white"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${title}, full-screen thumbnail ${
                        index + 1
                      }`}
                      className="h-14 w-20 object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}