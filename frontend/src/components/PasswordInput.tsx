"use client";

import {
  ComponentProps,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

type PasswordInputProps = Omit<
  ComponentProps<"input">,
  "type"
>;

export default function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const label = showPassword
    ? "Hide password"
    : "Show password";

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${className} pr-12`}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword((current) => !current)
        }
        aria-label={label}
        aria-pressed={showPassword}
        title={label}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-gray-500 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-green-700"
      >
        {showPassword ? (
          <EyeOff
            className="h-5 w-5"
            aria-hidden="true"
          />
        ) : (
          <Eye
            className="h-5 w-5"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}
