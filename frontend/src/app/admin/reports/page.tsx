"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Clock3,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import {
  AdminReport,
  dismissReport,
  getAdminReports,
  ReportStatus,
  suspendReportedListing,
} from "@/lib/reports";

type ReportFilter =
  | "all"
  | ReportStatus;

export default function AdminReportsPage() {
  const [reports, setReports] =
    useState<AdminReport[]>([]);

  const [filter, setFilter] =
    useState<ReportFilter>("pending");

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminReports(
          filter === "all"
            ? undefined
            : filter
        );

      setReports(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, [filter]);

  async function handleDismiss(
    reportId: number
  ) {
    const confirmed = window.confirm(
      "Dismiss this report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(reportId);

      const updatedReport =
        await dismissReport(reportId);

      updateReportInState(
        updatedReport
      );

      toast.success(
        "Report dismissed"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to dismiss report"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleSuspend(
    reportId: number
  ) {
    const confirmed = window.confirm(
      "Suspend this listing? It will no longer appear to tenants."
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(reportId);

      const updatedReport =
        await suspendReportedListing(
          reportId
        );

      updateReportInState(
        updatedReport
      );

      toast.success(
        "Listing suspended"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to suspend listing"
      );
    } finally {
      setProcessingId(null);
    }
  }

  function updateReportInState(
    updatedReport: AdminReport
  ) {
    if (
      filter !== "all" &&
      updatedReport.status !== filter
    ) {
      setReports((current) =>
        current.filter(
          (report) =>
            report.id !==
            updatedReport.id
        )
      );

      return;
    }

    setReports((current) =>
      current.map((report) =>
        report.id ===
        updatedReport.id
          ? updatedReport
          : report
      )
    );
  }

  function getStatusBadge(
    status: ReportStatus
  ) {
    if (status === "pending") {
      return {
        label: "Pending",
        className:
          "bg-amber-100 text-amber-700",
        icon: Clock3,
      };
    }

    if (status === "dismissed") {
      return {
        label: "Dismissed",
        className:
          "bg-gray-100 text-gray-700",
        icon: XCircle,
      };
    }

    return {
      label: "Action Taken",
      className:
        "bg-red-100 text-red-700",
      icon: ShieldAlert,
    };
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Listing Reports
            </h1>

            <p className="mt-2 text-gray-600">
              Review tenant reports and
              take action on suspicious
              listings.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterButton
            label="Pending"
            value="pending"
            activeFilter={filter}
            onClick={setFilter}
          />

          <FilterButton
            label="Dismissed"
            value="dismissed"
            activeFilter={filter}
            onClick={setFilter}
          />

          <FilterButton
            label="Action Taken"
            value="action_taken"
            activeFilter={filter}
            onClick={setFilter}
          />

          <FilterButton
            label="All"
            value="all"
            activeFilter={filter}
            onClick={setFilter}
          />
        </div>

        {loading ? (
          <p className="mt-10 text-gray-500">
            Loading reports...
          </p>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="Couldn't load reports"
              description="We had trouble loading listing reports. Check your connection and try again."
              onRetry={loadReports}
            />
          </div>
        ) : reports.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={ShieldCheck}
              title={
                filter === "pending"
                  ? "No reports to review"
                  : "No reports found"
              }
              description={
                filter === "pending"
                  ? "There are currently no unresolved listing reports."
                  : "There are no reports matching this status."
              }
            />
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {reports.map((report) => {
              const statusBadge =
                getStatusBadge(
                  report.status
                );

              const StatusIcon =
                statusBadge.icon;

              const processing =
                processingId ===
                report.id;

              return (
                <article
                  key={report.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {
                            report.listing
                              .title
                          }
                        </h2>

                        <span
                          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusBadge.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />

                          {
                            statusBadge.label
                          }
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />

                        {
                          report.listing
                            .location
                        }
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <p>
                        Report #{report.id}
                      </p>

                      <p className="mt-1">
                        {new Date(
                          report.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-red-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

                        <div>
                          <p className="text-sm font-semibold text-red-900">
                            {
                              report.reason
                            }
                          </p>

                          <p className="mt-2 text-sm leading-6 text-red-800">
                            {report.details ||
                              "No additional details provided."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Reported by
                      </p>

                      <p className="mt-2 font-medium text-gray-900">
                        {
                          report.reporter
                            .full_name
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          report.reporter
                            .email
                        }
                      </p>

                      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                        Listing status
                      </p>

                      <p className="mt-2 text-sm capitalize text-gray-700">
                        {
                          report.listing
                            .approval_status
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/listings/${report.listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-44 flex-1 items-center justify-center rounded-xl border border-indigo-200 px-5 py-3 font-medium text-indigo-700 hover:bg-indigo-50"
                      >
                        Review Listing
                      </Link>

                      {report.status ===
                        "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={
                              processing
                            }
                            onClick={() =>
                              handleDismiss(
                                report.id
                              )
                            }
                            className="min-w-44 flex-1 rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                          >
                            {processing
                              ? "Processing..."
                              : "Dismiss Report"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              processing
                            }
                            onClick={() =>
                              handleSuspend(
                                report.id
                              )
                            }
                            className="min-w-44 flex-1 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
                          >
                            {processing
                              ? "Processing..."
                              : "Suspend Listing"}
                          </button>
                        </>
                      )}
                    </div>

                    {report.status !==
                      "pending" &&
                      report.reviewed_at && (
                        <p className="mt-4 text-sm text-gray-500">
                          Reviewed{" "}
                          {new Date(
                            report.reviewed_at
                          ).toLocaleString()}
                        </p>
                      )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

type FilterButtonProps = {
  label: string;
  value: ReportFilter;
  activeFilter: ReportFilter;
  onClick: (
    value: ReportFilter
  ) => void;
};

function FilterButton({
  label,
  value,
  activeFilter,
  onClick,
}: FilterButtonProps) {
  const isActive =
    activeFilter === value;

  return (
    <button
      type="button"
      onClick={() =>
        onClick(value)
      }
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-gray-950 text-white"
          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}