"use client";

import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content right now. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white px-8 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-gray-600">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}