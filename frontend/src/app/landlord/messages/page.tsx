"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { MessageSquare } from "lucide-react";

import Navbar from "@/components/Navbar";
import ConversationCard from "@/components/ConversationCard";
import ConversationCardSkeleton from "@/components/ConversationCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import {
  Conversation,
  getConversations,
  MESSAGE_POLL_INTERVAL,
} from "@/lib/messages";

export default function LandlordMessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const hasLoadedOnce = useRef(false);

  const intervalRef = useRef<
    ReturnType<typeof setInterval> | null
  >(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const loadConversations = useCallback(
    async (
      showLoading = false
    ): Promise<boolean> => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError("");

        const data =
          await getConversations();

        setConversations(data);

        hasLoadedOnce.current = true;

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load conversations";

        if (message === "Unauthorized") {
          stopPolling();

          setError(
            "Your session has expired. Please log in again."
          );

          return false;
        }

        if (!hasLoadedOnce.current) {
          setError(message);
        } else {
          console.error(
            "Failed to refresh conversations:",
            error
          );
        }

        return false;
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [stopPolling]
  );

  const startPolling = useCallback(() => {
    stopPolling();

    intervalRef.current = setInterval(
      () => {
        loadConversations(false);
      },
      MESSAGE_POLL_INTERVAL
    );
  }, [
    loadConversations,
    stopPolling,
  ]);

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      if (!isMounted) {
        return;
      }

      const success =
        await loadConversations(true);

      if (
        isMounted &&
        success
      ) {
        startPolling();
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
      stopPolling();
    };
  }, [
    loadConversations,
    startPolling,
    stopPolling,
  ]);

  async function handleRetry() {
    hasLoadedOnce.current = false;

    const success =
      await loadConversations(true);

    if (success) {
      startPolling();
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Messages
          </h1>

          <p className="mt-2 text-gray-600">
            Tenant enquiries about your properties.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <ConversationCardSkeleton
                key={index}
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title={
                error.includes(
                  "session has expired"
                )
                  ? "Session expired"
                  : "Couldn't load conversations"
              }
              description={
                error.includes(
                  "session has expired"
                )
                  ? "Please log in again to continue viewing tenant enquiries."
                  : "We had trouble loading your messages. Check your connection and try again."
              }
              onRetry={handleRetry}
            />
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={MessageSquare}
              title="No tenant enquiries yet"
              description="Messages from tenants interested in your properties will appear here."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {conversations.map(
              (conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={
                    conversation
                  }
                  viewerRole="landlord"
                />
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}