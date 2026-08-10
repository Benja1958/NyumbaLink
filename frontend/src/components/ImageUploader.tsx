"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  ImagePlus,
  X,
} from "lucide-react";

import {
  checkImageDimensions,
  ImageDimensionResult,
  MIN_IMAGE_HEIGHT,
  MIN_IMAGE_WIDTH,
} from "@/lib/imageValidation";

type ImageUploaderProps = {
  files: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
};

export default function ImageUploader({
  files,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [previews, setPreviews] =
    useState<string[]>([]);

  const [
    dimensionResults,
    setDimensionResults,
  ] = useState<ImageDimensionResult[]>(
    []
  );

  const [
    checkingDimensions,
    setCheckingDimensions,
  ] = useState(false);

  useEffect(() => {
    const urls = files.map(
      (file) =>
        URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [files]);

  useEffect(() => {
    let cancelled = false;

    async function inspectImages() {
      if (files.length === 0) {
        setDimensionResults([]);
        return;
      }

      try {
        setCheckingDimensions(true);

        const results =
          await Promise.all(
            files.map((file) =>
              checkImageDimensions(
                file
              )
            )
          );

        if (!cancelled) {
          setDimensionResults(
            results
          );
        }
      } catch (error) {
        console.error(
          "Failed to inspect image dimensions:",
          error
        );
      } finally {
        if (!cancelled) {
          setCheckingDimensions(
            false
          );
        }
      }
    }

    inspectImages();

    return () => {
      cancelled = true;
    };
  }, [files]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles =
      Array.from(
        event.target.files ?? []
      );

    const remainingSlots =
      maxImages - files.length;

    const filesToAdd =
      selectedFiles.slice(
        0,
        remainingSlots
      );

    onChange([
      ...files,
      ...filesToAdd,
    ]);

    event.target.value = "";
  }

  function removeImage(
    index: number
  ) {
    onChange(
      files.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  }

  const lowResolutionImages =
    dimensionResults.filter(
      (result) =>
        result.isLowResolution
    );

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Property Photos
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-green-600 hover:bg-green-50">
        <ImagePlus className="h-8 w-8 text-gray-400" />

        <span className="mt-3 font-medium text-gray-700">
          Upload property photos
        </span>

        <span className="mt-1 text-sm text-gray-500">
          JPG, PNG or WEBP · Maximum{" "}
          {maxImages}
        </span>

        <span className="mt-1 text-xs text-gray-400">
          Recommended resolution: at
          least {MIN_IMAGE_WIDTH} ×{" "}
          {MIN_IMAGE_HEIGHT}px
        </span>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={
            handleFileChange
          }
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {previews.map(
              (
                preview,
                index
              ) => {
                const dimension =
                  dimensionResults[
                    index
                  ];

                const isLowResolution =
                  dimension
                    ?.isLowResolution ??
                  false;

                return (
                  <div
                    key={preview}
                    className={`relative overflow-hidden rounded-xl border ${
                      isLowResolution
                        ? "border-amber-400"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={preview}
                      alt={`Property preview ${
                        index + 1
                      }`}
                      className="h-36 w-full object-cover"
                    />

                    {index ===
                      0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-green-800 px-2 py-1 text-xs font-medium text-white">
                        Cover
                      </span>
                    )}

                    {isLowResolution && (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Low resolution
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {dimension && (
                      <div className="bg-white px-3 py-2 text-xs text-gray-500">
                        {
                          dimension.width
                        }{" "}
                        ×{" "}
                        {
                          dimension.height
                        }{" "}
                        px
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {checkingDimensions && (
            <p className="mt-3 text-sm text-gray-500">
              Checking image
              quality...
            </p>
          )}

          {lowResolutionImages.length >
            0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Some photos may
                    appear blurry
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    We recommend
                    property photos of
                    at least{" "}
                    {MIN_IMAGE_WIDTH} ×{" "}
                    {MIN_IMAGE_HEIGHT}px
                    for the best
                    quality. You can
                    still upload these
                    photos.
                  </p>

                  <div className="mt-3 space-y-1">
                    {lowResolutionImages.map(
                      (
                        result
                      ) => (
                        <p
                          key={
                            result
                              .file
                              .name
                          }
                          className="text-xs text-amber-700"
                        >
                          {
                            result
                              .file
                              .name
                          }{" "}
                          —{" "}
                          {
                            result.width
                          }{" "}
                          ×{" "}
                          {
                            result.height
                          }{" "}
                          px
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-3 text-sm text-gray-500">
            {files.length} of{" "}
            {maxImages} photos selected
          </p>
        </>
      )}
    </div>
  );
}