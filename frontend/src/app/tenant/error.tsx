"use client";

import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

type TenantErrorProps = {
  error: Error & {
    digest?: string;
  };
};

export default function TenantError({
  error,
}: TenantErrorProps) {
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
          title="Couldn't load properties"
          description="We had trouble loading available properties. Check your connection and try again."
          onRetry={handleRetry}
        />
      </main>
    </>
  );
}