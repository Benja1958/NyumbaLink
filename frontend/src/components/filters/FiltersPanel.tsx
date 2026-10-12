"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { X } from "lucide-react";

import {
  CountOptions,
  RentRangeInputs,
} from "@/components/filters/FilterControls";

import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  EMPTY_FILTERS,
  FilterValues,
  getRentRangeError,
} from "@/lib/listingFilters";

type FiltersPanelProps = {
  // Snapshot of the applied filters at the moment the panel opens.
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
  onClose: () => void;
};

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export default function FiltersPanel({
  initialValues,
  onApply,
  onClose,
}: FiltersPanelProps) {
  const [draft, setDraft] =
    useState<FilterValues>(initialValues);

  const dialogRef =
    useRef<HTMLDivElement>(null);

  const rentError = getRentRangeError(
    draft.minRent,
    draft.maxRent
  );

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    dialogRef.current
      ?.querySelector<HTMLElement>(
        "#filters-panel-location"
      )
      ?.focus();

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  function updateDraft(
    partial: Partial<FilterValues>
  ) {
    setDraft((current) => ({
      ...current,
      ...partial,
    }));
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();

      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        FOCUSABLE
      )
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (rentError) {
      return;
    }

    onApply(draft);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      onKeyDown={handleKeyDown}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gray-950/40"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-panel-title"
        className="relative flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            id="filters-panel-title"
            className="text-lg font-semibold text-gray-900"
          >
            Filters
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-gray-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            <div>
              <label
                htmlFor="filters-panel-location"
                className="mb-3 block text-sm font-semibold text-gray-900"
              >
                Location
              </label>

              <input
                id="filters-panel-location"
                type="text"
                placeholder="e.g. Westlands, Kilimani"
                value={draft.location}
                onChange={(event) =>
                  updateDraft({
                    location: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-gray-900">
                Monthly rent
              </legend>

              <RentRangeInputs
                idPrefix="filters-panel"
                minRent={draft.minRent}
                maxRent={draft.maxRent}
                onChange={updateDraft}
                error={rentError}
              />
            </fieldset>

            <CountOptions
              legend="Bedrooms"
              options={BEDROOM_OPTIONS}
              value={draft.bedrooms}
              onChange={(bedrooms) =>
                updateDraft({ bedrooms })
              }
            />

            <CountOptions
              legend="Bathrooms"
              options={BATHROOM_OPTIONS}
              value={draft.bathrooms}
              onChange={(bathrooms) =>
                updateDraft({ bathrooms })
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={() =>
                setDraft(EMPTY_FILTERS)
              }
              className="rounded-lg px-2 py-2 text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-gray-900"
            >
              Clear all
            </button>

            <button
              type="submit"
              disabled={Boolean(rentError)}
              className="rounded-lg bg-gray-950 px-6 py-3 font-medium text-white transition hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Show properties
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
