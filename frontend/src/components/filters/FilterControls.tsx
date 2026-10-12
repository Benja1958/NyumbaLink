"use client";

type CountOptionsProps = {
  legend: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  hideLegend?: boolean;
};

export function CountOptions({
  legend,
  options,
  value,
  onChange,
  hideLegend = false,
}: CountOptionsProps) {
  return (
    <fieldset>
      <legend
        className={
          hideLegend
            ? "sr-only"
            : "mb-3 text-sm font-semibold text-gray-900"
        }
      >
        {legend}
      </legend>

      <div className="flex flex-wrap gap-2">
        {["", ...options].map((option) => {
          const selected = value === option;

          return (
            <button
              key={option || "any"}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={`min-w-14 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
                selected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
              }`}
            >
              {option ? `${option}+` : "Any"}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

type RentRangeInputsProps = {
  idPrefix: string;
  minRent: string;
  maxRent: string;
  onChange: (
    values: {
      minRent: string;
      maxRent: string;
    }
  ) => void;
  error?: string;
};

export function RentRangeInputs({
  idPrefix,
  minRent,
  maxRent,
  onChange,
  error,
}: RentRangeInputsProps) {
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-gray-900";

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${idPrefix}-min-rent`}
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Minimum (KSh)
          </label>

          <input
            id={`${idPrefix}-min-rent`}
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="No min"
            value={minRent}
            onChange={(event) =>
              onChange({
                minRent: event.target.value,
                maxRent,
              })
            }
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${idPrefix}-rent-error`
                : undefined
            }
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-max-rent`}
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Maximum (KSh)
          </label>

          <input
            id={`${idPrefix}-max-rent`}
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="No max"
            value={maxRent}
            onChange={(event) =>
              onChange({
                minRent,
                maxRent: event.target.value,
              })
            }
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${idPrefix}-rent-error`
                : undefined
            }
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p
          id={`${idPrefix}-rent-error`}
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
