"use client";

import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-20">
        <ErrorState
          title="Something went wrong"
          description="We couldn't load this page right now. Please try again."
          onRetry={reset}
        />
      </main>
    </>
  );
}