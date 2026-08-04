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
  Images,
  X,
} from "lucide-react";

import { ListingImage } from "@/types/listing";

type AdminImageGalleryProps = {
  images: ListingImage[];
  fallbackImage?: string | null;
  title: string;
};

export default function AdminImageGallery({
  images,
  fallbackImage,
  title,
}: AdminImageGalleryProps) {
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

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] =
    useState(0);

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
    if (!isOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
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

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [
    isOpen,
    showPrevious,
    showNext,
  ]);

  if (imageUrls.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-gray-500">
        <div className="text-center">
          <Images className="mx-auto h-9 w-9 text-gray-300" />

          <p className="mt-2 text-sm">
            No photos uploaded
          </p>
        </div>
      </div>
    );
  }

  const currentImage =
    imageUrls[currentIndex];

  return (
    <>
      <div className="relative">
        <img
          src={imageUrls[0]}
          alt={title}
          className="aspect-[4/3] w-full bg-gray-100 object-cover object-center"
        />

        <button
          type="button"
          onClick={() => {
            setCurrentIndex(0);
            setIsOpen(true);
          }}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/75 px-3 py-2 text-sm font-medium text-white transition hover:bg-black/90"
        >
          <Images className="h-4 w-4" />

          View all photos
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {imageUrls.length}
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image review`}
        >
          <header className="flex items-center justify-between px-6 py-4 text-white">
            <div>
              <h2 className="font-semibold">
                {title}
              </h2>

              <p className="mt-1 text-sm text-white/70">
                Photo {currentIndex + 1} of{" "}
                {imageUrls.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close image gallery"
              className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >
              <X className="h-7 w-7" />
            </button>
          </header>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-16 py-4">
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
              alt={`${title}, photo ${
                currentIndex + 1
              }`}
              className="max-h-[75vh] max-w-full object-contain"
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
                    key={`${imageUrl}-${index}`}
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
                      alt={`${title}, thumbnail ${
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