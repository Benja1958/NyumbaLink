"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

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
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [files]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    const remainingSlots =
      maxImages - files.length;

    const filesToAdd = selectedFiles.slice(
      0,
      remainingSlots
    );

    onChange([
      ...files,
      ...filesToAdd,
    ]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    onChange(
      files.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900">
        Property Photos
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-green-600 hover:bg-green-50">
        <ImagePlus className="h-8 w-8 text-gray-400" />

        <span className="mt-3 font-medium text-gray-700">
          Upload property photos
        </span>

        <span className="mt-1 text-sm text-gray-500">
          JPG, PNG or WEBP · Maximum {maxImages}
        </span>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {previews.map(
              (preview, index) => (
                <div
                  key={preview}
                  className="relative overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={preview}
                    alt={`Property preview ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-green-800 px-2 py-1 text-xs font-medium text-white">
                      Cover
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            )}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {files.length} of {maxImages} photos selected
          </p>
        </>
      )}
    </div>
  );
}