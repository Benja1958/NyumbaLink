"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { Search } from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] =
    useState("");

  const [minRent, setMinRent] =
    useState("");

  const [maxRent, setMaxRent] =
    useState("");

  const [bedrooms, setBedrooms] =
    useState("");

  const [bathrooms, setBathrooms] =
    useState("");

  useEffect(() => {
    setLocation(
      searchParams.get("location") ?? ""
    );

    setMinRent(
      searchParams.get("min_rent") ?? ""
    );

    setMaxRent(
      searchParams.get("max_rent") ?? ""
    );

    setBedrooms(
      searchParams.get("bedrooms") ?? ""
    );

    setBathrooms(
      searchParams.get("bathrooms") ?? ""
    );
  }, [searchParams]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const params =
      new URLSearchParams();

    if (location.trim()) {
      params.set(
        "location",
        location.trim()
      );
    }

    if (minRent) {
      params.set(
        "min_rent",
        minRent
      );
    }

    if (maxRent) {
      params.set(
        "max_rent",
        maxRent
      );
    }

    if (bedrooms) {
      params.set(
        "bedrooms",
        bedrooms
      );
    }

    if (bathrooms) {
      params.set(
        "bathrooms",
        bathrooms
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/tenant?${query}`
        : "/tenant"
    );
  }

  function clearFilters() {
    setLocation("");
    setMinRent("");
    setMaxRent("");
    setBedrooms("");
    setBathrooms("");

    router.replace("/tenant");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Location
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              name="location"
              type="text"
              placeholder="Westlands..."
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Minimum Rent
          </label>

          <input
            name="min_rent"
            type="number"
            min="0"
            placeholder="10000"
            value={minRent}
            onChange={(event) =>
              setMinRent(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Maximum Rent
          </label>

          <input
            name="max_rent"
            type="number"
            min="0"
            placeholder="50000"
            value={maxRent}
            onChange={(event) =>
              setMaxRent(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bedrooms
          </label>

          <select
            name="bedrooms"
            value={bedrooms}
            onChange={(event) =>
              setBedrooms(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          >
            <option value="">
              Any
            </option>
            <option value="1">
              1+
            </option>
            <option value="2">
              2+
            </option>
            <option value="3">
              3+
            </option>
            <option value="4">
              4+
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bathrooms
          </label>

          <select
            name="bathrooms"
            value={bathrooms}
            onChange={(event) =>
              setBathrooms(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          >
            <option value="">
              Any
            </option>
            <option value="1">
              1+
            </option>
            <option value="2">
              2+
            </option>
            <option value="3">
              3+
            </option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-gray-950 px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Search Properties
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </form>
  );
}