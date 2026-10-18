"use client";

import {
  ComponentProps,
  ReactNode,
} from "react";

import { ChevronDown } from "lucide-react";

type FilterChipProps = Omit<
  ComponentProps<"button">,
  "type" | "children"
> & {
  label: string;
  active: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  showChevron?: boolean;
  expanded?: boolean;
};

export default function FilterChip({
  label,
  active,
  icon,
  badge,
  showChevron = false,
  expanded = false,
  className = "",
  ...props
}: FilterChipProps) {
  return (
    <button
      {...props}
      type="button"
      aria-expanded={expanded}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition md:min-h-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
        active
          ? "border-gray-900 bg-gray-100 font-semibold text-gray-900"
          : "border-gray-300 bg-white font-medium text-gray-800 hover:border-gray-500"
      } ${className}`}
    >
      {icon}

      <span>{label}</span>

      {badge}

      {showChevron && (
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-gray-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      )}
    </button>
  );
}
