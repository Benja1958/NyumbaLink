// Shared tenant listing filter model. The URL query string is the single
// source of truth; every filter control reads from and writes to it via
// these helpers.

export type FilterValues = {
  location: string;
  minRent: string;
  maxRent: string;
  bedrooms: string;
  bathrooms: string;
};

export const EMPTY_FILTERS: FilterValues = {
  location: "",
  minRent: "",
  maxRent: "",
  bedrooms: "",
  bathrooms: "",
};

export const BEDROOM_OPTIONS = ["1", "2", "3", "4"];
export const BATHROOM_OPTIONS = ["1", "2", "3"];

type ReadableParams = {
  get(name: string): string | null;
};

export function parseFilters(
  params: ReadableParams
): FilterValues {
  return {
    location: params.get("location") ?? "",
    minRent: params.get("min_rent") ?? "",
    maxRent: params.get("max_rent") ?? "",
    bedrooms: params.get("bedrooms") ?? "",
    bathrooms: params.get("bathrooms") ?? "",
  };
}

export function buildFilterQuery(
  values: FilterValues
): string {
  const params = new URLSearchParams();

  if (values.location.trim()) {
    params.set("location", values.location.trim());
  }

  if (values.minRent) {
    params.set("min_rent", values.minRent);
  }

  if (values.maxRent) {
    params.set("max_rent", values.maxRent);
  }

  if (values.bedrooms) {
    params.set("bedrooms", values.bedrooms);
  }

  if (values.bathrooms) {
    params.set("bathrooms", values.bathrooms);
  }

  return params.toString();
}

export function countActiveFilters(
  values: FilterValues
): number {
  return [
    values.location.trim(),
    values.minRent || values.maxRent,
    values.bedrooms,
    values.bathrooms,
  ].filter(Boolean).length;
}

export function getRentRangeError(
  minRent: string,
  maxRent: string
): string {
  if (
    minRent &&
    maxRent &&
    Number(minRent) > Number(maxRent)
  ) {
    return "Minimum rent can’t be more than maximum rent.";
  }

  return "";
}

function formatKsh(value: string): string {
  const amount = Number(value);

  if (amount >= 1000) {
    const thousands = amount / 1000;

    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }

  return amount.toLocaleString("en-KE");
}

export function formatPriceLabel(
  values: FilterValues
): string | null {
  const { minRent, maxRent } = values;

  if (minRent && maxRent) {
    return `KSh ${formatKsh(minRent)}–${formatKsh(maxRent)}`;
  }

  if (minRent) {
    return `KSh ${formatKsh(minRent)}+`;
  }

  if (maxRent) {
    return `Up to KSh ${formatKsh(maxRent)}`;
  }

  return null;
}
