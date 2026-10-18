import Link from "next/link";
import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center md:px-8 md:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 md:h-16 md:w-16">
        <Icon className="h-7 w-7 text-indigo-600 md:h-8 md:w-8" />
      </div>

      <h2 className="mt-4 text-xl font-semibold text-gray-900 md:mt-6 md:text-2xl">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 md:mt-3 md:text-base">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-8 inline-flex rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}