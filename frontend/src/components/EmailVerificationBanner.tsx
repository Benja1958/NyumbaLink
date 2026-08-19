"use client";

import { useState } from "react";
import {
  MailCheck,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import {
  resendVerificationEmail,
} from "@/lib/auth";

export default function EmailVerificationBanner() {
  const {
    user,
    loading,
  } = useAuth();

  const [sending, setSending] =
    useState(false);

  if (
    loading ||
    !user ||
    user.email_verified
  ) {
    return null;
  }

  async function handleResend() {
    try {
      setSending(true);

      const result =
        await resendVerificationEmail();

      toast.success(
        result.message ||
          "Verification email sent"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification email"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

        <div className="flex-1">
          <p className="font-medium text-amber-900">
            Verify your email address
          </p>

          <p className="mt-1 text-sm text-amber-700">
            Verify your email to
            strengthen your account
            security and trust.
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="mt-3 text-sm font-medium text-amber-900 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? "Sending..."
              : "Resend verification email"}
          </button>
        </div>
      </div>
    </div>
  );
}