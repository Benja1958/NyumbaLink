"use client";

import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

type ListingErrorProps = {
  error: Error & {
    digest?: string;
  };
};

export default function ListingError({
  error,
}: ListingErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  function handleRetry() {
    window.location.reload();
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-20">
        <ErrorState
          title="Couldn't load this property"
          description="We had trouble loading the property details. Please check your connection and try again."
          onRetry={handleRetry}
        />
      </main>
    </>
  );
}