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

export default function TenantMessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const hasLoadedOnce = useRef(false);

  const loadConversations = useCallback(
    async (
      showLoading = false
    ) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError("");

        const data =
          await getConversations();

        setConversations(data);
        hasLoadedOnce.current = true;
      } catch (error) {
        /*
         * Only show the full-page error if
         * we have never successfully loaded
         * conversations before.
         *
         * If background polling fails later,
         * keep showing the existing inbox.
         */
        if (!hasLoadedOnce.current) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load conversations"
          );
        } else {
          console.error(
            "Failed to refresh conversations:",
            error
          );
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      if (!isMounted) {
        return;
      }

      await loadConversations(true);
    }

    initialLoad();

    const interval = setInterval(
      () => {
        if (isMounted) {
          loadConversations(false);
        }
      },
      MESSAGE_POLL_INTERVAL
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [loadConversations]);

  async function handleRetry() {
    hasLoadedOnce.current = false;

    await loadConversations(true);
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
            Conversations about properties
            you&apos;re interested in.
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
              title="Couldn't load conversations"
              description="We had trouble loading your messages. Check your connection and try again."
              onRetry={handleRetry}
            />
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={MessageSquare}
              title="No conversations yet"
              description="When you contact a landlord, your conversations will appear here."
              actionLabel="Browse Properties"
              actionHref="/tenant"
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
                  viewerRole="tenant"
                />
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}