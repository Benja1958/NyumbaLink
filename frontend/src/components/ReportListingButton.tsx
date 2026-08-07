"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  X,
} from "lucide-react";

import {
  createReport,
  REPORT_REASONS,
  ReportReason,
} from "@/lib/reports";

import { toast } from "sonner";

type ReportListingButtonProps = {
  listingId: number;
};

export default function ReportListingButton({
  listingId,
}: ReportListingButtonProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [reason, setReason] =
    useState<ReportReason>(
      REPORT_REASONS[0]
    );

  const [details, setDetails] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  function closeModal() {
    if (submitting) {
      return;
    }

    setIsOpen(false);

    if (submitted) {
      setSubmitted(false);
      setReason(REPORT_REASONS[0]);
      setDetails("");
    }

    toast.success(
      "Report submitted"
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      reason === "Other" &&
      !details.trim()
    ) {
      setError(
        "Please provide details for your report."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReport(
        listingId,
        reason,
        details
      );

      setSubmitted(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to report listing"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
      >
        <Flag className="h-4 w-4" />
        Report Listing
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Report listing"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Report this listing
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Help us keep NyumbaLink safe
                  and trustworthy.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close report form"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Report submitted
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Thank you. Our admin team will
                  review this listing.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 rounded-xl bg-green-800 px-6 py-3 font-medium text-white hover:bg-green-900"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 px-6 py-6"
              >
                <div className="rounded-xl bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                    <p className="text-sm leading-6 text-amber-800">
                      Only report listings that
                      appear misleading, unsafe,
                      fraudulent, duplicated, or
                      unavailable.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="report-reason"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Reason
                  </label>

                  <select
                    id="report-reason"
                    value={reason}
                    onChange={(event) =>
                      setReason(
                        event.target
                          .value as ReportReason
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                  >
                    {REPORT_REASONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="report-details"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Additional details
                    {reason === "Other"
                      ? " *"
                      : " (optional)"}
                  </label>

                  <textarea
                    id="report-details"
                    value={details}
                    onChange={(event) =>
                      setDetails(
                        event.target.value
                      )
                    }
                    maxLength={1000}
                    placeholder="Explain what seems wrong with this listing..."
                    className="h-32 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {details.length}/1000
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="flex-1 rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}