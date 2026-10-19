"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import FilterChip from "@/components/filters/FilterChip";
import FiltersPanel from "@/components/filters/FiltersPanel";
import {
  CountOptions,
  RentRangeInputs,
} from "@/components/filters/FilterControls";

import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  EMPTY_FILTERS,
  FilterValues,
  buildFilterQuery,
  countActiveFilters,
  formatPriceLabel,
  getRentRangeError,
  parseFilters,
} from "@/lib/listingFilters";

type QuickMenu = "price" | "beds" | "baths";

const MENU_WIDTH = 304;

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Applied filters come straight from the URL — the single source of truth
  // shared by the search box, the quick chips and the full Filters panel.
  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams]
  );

  const [isPending, startTransition] =
    useTransition();

  const [openMenu, setOpenMenu] =
    useState<QuickMenu | null>(null);

  const [menuLeft, setMenuLeft] =
    useState(0);

  const [panelOpen, setPanelOpen] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const filtersChipRef =
    useRef<HTMLButtonElement>(null);

  const chipRefs = useRef<
    Partial<Record<QuickMenu, HTMLButtonElement | null>>
  >({});

  const activeCount =
    countActiveFilters(filters);

  const priceLabel =
    formatPriceLabel(filters);

  function applyFilters(
    next: FilterValues
  ) {
    const query = buildFilterQuery(next);

    startTransition(() => {
      router.push(
        query
          ? `${pathname}?${query}`
          : pathname,
        { scroll: false }
      );
    });
  }

  function updateFilters(
    partial: Partial<FilterValues>
  ) {
    applyFilters({
      ...filters,
      ...partial,
    });
  }

  function closeMenu(
    restoreFocus = true
  ) {
    const menu = openMenu;

    setOpenMenu(null);

    if (restoreFocus && menu) {
      chipRefs.current[menu]?.focus();
    }
  }

  function toggleMenu(menu: QuickMenu) {
    if (openMenu === menu) {
      setOpenMenu(null);

      return;
    }

    const chip = chipRefs.current[menu];
    const wrapper = wrapperRef.current;

    if (chip && wrapper) {
      const offset =
        chip.getBoundingClientRect().left -
        wrapper.getBoundingClientRect().left;

      const width = Math.min(
        MENU_WIDTH,
        wrapper.clientWidth
      );

      setMenuLeft(
        Math.max(
          0,
          Math.min(
            offset,
            wrapper.clientWidth - width
          )
        )
      );
    }

    setOpenMenu(menu);
  }

  // Close quick menus on outside click / Escape; move focus into the menu.
  useEffect(() => {
    if (!openMenu) {
      return;
    }

    menuRef.current
      ?.querySelector<HTMLElement>(
        "input, button"
      )
      ?.focus();

    function handlePointerDown(
      event: PointerEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        chipRefs.current[openMenu!]?.focus();
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );
    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [openMenu]);

  function openPanel() {
    setOpenMenu(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    filtersChipRef.current?.focus();
  }

  return (
    <div className="mt-5 md:mt-8">
      <LocationSearch
        key={filters.location}
        initialLocation={filters.location}
        onSearch={(location) =>
          updateFilters({ location })
        }
      />

      <div
        ref={wrapperRef}
        className="relative mt-4"
      >
        <div
          role="toolbar"
          aria-label="Property filters"
          onScroll={() => setOpenMenu(null)}
          className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <FilterChip
            ref={filtersChipRef}
            label="Filters"
            active={activeCount > 0}
            expanded={panelOpen}
            aria-haspopup="dialog"
            onClick={openPanel}
            icon={
              <SlidersHorizontal
                aria-hidden="true"
                className="h-4 w-4"
              />
            }
            badge={
              activeCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1.5 text-xs font-semibold text-white">
                  {activeCount}
                  <span className="sr-only">
                    {" "}active
                  </span>
                </span>
              )
            }
          />

          <FilterChip
            ref={(node) => {
              chipRefs.current.price = node;
            }}
            label={priceLabel ?? "Price"}
            active={Boolean(priceLabel)}
            expanded={openMenu === "price"}
            aria-haspopup="dialog"
            aria-controls="filter-menu-price"
            showChevron
            onClick={() => toggleMenu("price")}
          />

          <FilterChip
            ref={(node) => {
              chipRefs.current.beds = node;
            }}
            label={
              filters.bedrooms
                ? `${filters.bedrooms}+ beds`
                : "Beds"
            }
            active={Boolean(filters.bedrooms)}
            expanded={openMenu === "beds"}
            aria-haspopup="dialog"
            aria-controls="filter-menu-beds"
            showChevron
            onClick={() => toggleMenu("beds")}
          />

          <FilterChip
            ref={(node) => {
              chipRefs.current.baths = node;
            }}
            label={
              filters.bathrooms
                ? `${filters.bathrooms}+ baths`
                : "Bathrooms"
            }
            active={Boolean(filters.bathrooms)}
            expanded={openMenu === "baths"}
            aria-haspopup="dialog"
            aria-controls="filter-menu-baths"
            showChevron
            onClick={() => toggleMenu("baths")}
          />

          {activeCount > 0 && (
            <button
              type="button"
              onClick={() =>
                applyFilters(EMPTY_FILTERS)
              }
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-gray-900"
            >
              Clear all
            </button>
          )}

          <span
            aria-live="polite"
            className="shrink-0 text-sm text-gray-500"
          >
            {isPending ? "Updating…" : ""}
          </span>

          <span
            aria-hidden="true"
            className="w-2 shrink-0 md:hidden"
          />
        </div>

        {openMenu && (
          <div
            ref={menuRef}
            id={`filter-menu-${openMenu}`}
            role="dialog"
            aria-label={
              openMenu === "price"
                ? "Price filter"
                : openMenu === "beds"
                  ? "Bedrooms filter"
                  : "Bathrooms filter"
            }
            style={{
              left: menuLeft,
              width: `min(${MENU_WIDTH}px, 100%)`,
            }}
            className="absolute top-full z-30 mt-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg"
          >
            {openMenu === "price" && (
              <PriceMenu
                minRent={filters.minRent}
                maxRent={filters.maxRent}
                onApply={(values) => {
                  updateFilters(values);
                  closeMenu();
                }}
              />
            )}

            {openMenu === "beds" && (
              <CountOptions
                legend="Minimum bedrooms"
                options={BEDROOM_OPTIONS}
                value={filters.bedrooms}
                onChange={(bedrooms) => {
                  updateFilters({ bedrooms });
                  closeMenu();
                }}
              />
            )}

            {openMenu === "baths" && (
              <CountOptions
                legend="Minimum bathrooms"
                options={BATHROOM_OPTIONS}
                value={filters.bathrooms}
                onChange={(bathrooms) => {
                  updateFilters({ bathrooms });
                  closeMenu();
                }}
              />
            )}
          </div>
        )}
      </div>

      {panelOpen && (
        <FiltersPanel
          initialValues={filters}
          onClose={closePanel}
          onApply={(values) => {
            applyFilters(values);
            closePanel();
          }}
        />
      )}
    </div>
  );
}

type LocationSearchProps = {
  initialLocation: string;
  onSearch: (location: string) => void;
};

function LocationSearch({
  initialLocation,
  onSearch,
}: LocationSearchProps) {
  const [location, setLocation] =
    useState(initialLocation);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    onSearch(location.trim());
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full max-w-full items-center gap-2 rounded-full border border-gray-300 bg-white py-1 pl-4 pr-1 shadow-sm focus-within:border-gray-900 md:py-1.5 md:pl-5 md:pr-1.5"
    >
      <Search
        aria-hidden="true"
        className="hidden h-5 w-5 shrink-0 text-gray-400 md:block"
      />

      <label
        htmlFor="location-search"
        className="sr-only"
      >
        Search by location
      </label>

      <input
        id="location-search"
        type="search"
        placeholder="Search by location, e.g. Westlands"
        value={location}
        onChange={(event) =>
          setLocation(event.target.value)
        }
        className="min-w-0 flex-1 text-ellipsis bg-transparent py-2.5 text-base text-gray-900 outline-none placeholder:text-gray-500 md:py-2"
      />

      <button
        type="submit"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 md:h-auto md:w-auto md:px-5 md:py-2.5"
      >
        <Search
          aria-hidden="true"
          className="h-5 w-5 md:hidden"
        />

        <span className="sr-only md:not-sr-only">
          Search
        </span>
      </button>
    </form>
  );
}

type PriceMenuProps = {
  minRent: string;
  maxRent: string;
  onApply: (values: {
    minRent: string;
    maxRent: string;
  }) => void;
};

function PriceMenu({
  minRent,
  maxRent,
  onApply,
}: PriceMenuProps) {
  const [range, setRange] = useState({
    minRent,
    maxRent,
  });

  const error = getRentRangeError(
    range.minRent,
    range.maxRent
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!error) {
      onApply(range);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3 text-sm font-semibold text-gray-900">
        Monthly rent
      </p>

      <RentRangeInputs
        idPrefix="price-menu"
        minRent={range.minRent}
        maxRent={range.maxRent}
        onChange={setRange}
        error={error}
      />

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            onApply({
              minRent: "",
              maxRent: "",
            })
          }
          className="text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900"
        >
          Clear
        </button>

        <button
          type="submit"
          disabled={Boolean(error)}
          className="rounded-lg bg-gray-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
