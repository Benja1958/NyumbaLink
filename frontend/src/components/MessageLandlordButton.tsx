"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { createConversation } from "@/lib/messages";

type MessageLandlordButtonProps = {
  listingId: number;
};

export default function MessageLandlordButton({
  listingId,
}: MessageLandlordButtonProps) {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "tenant") {
      setError(
        "Only tenants can start conversations."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const conversation =
        await createConversation(listingId);

      router.push(
        `/messages/${conversation.id}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start conversation"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || authLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-900 disabled:opacity-50"
      >
        <MessageSquare className="h-4 w-4" />

        {loading
          ? "Opening conversation..."
          : "Message Landlord"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}