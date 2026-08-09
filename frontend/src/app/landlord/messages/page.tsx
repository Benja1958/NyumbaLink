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

  const hasLoadedOnce =
    useRef(false);

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

        hasLoadedOnce.current =
          true;
      } catch (error) {
        if (!hasLoadedOnce.current) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load conversations"
          );
        } else {
          console.error(
            "Failed to refresh landlord conversations:",
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
    loadConversations(true);

    const interval =
      setInterval(
        () => {
          loadConversations(false);
        },
        MESSAGE_POLL_INTERVAL
      );

    return () => {
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
            Tenant enquiries about your
            properties.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <ConversationCardSkeleton
                  key={index}
                />
              )
            )}
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="Couldn't load conversations"
              description="We had trouble loading your tenant enquiries. Check your connection and try again."
              onRetry={
                handleRetry
              }
            />
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={
                MessageSquare
              }
              title="No tenant enquiries yet"
              description="Messages from tenants interested in your properties will appear here."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {conversations.map(
              (
                conversation
              ) => (
                <ConversationCard
                  key={
                    conversation.id
                  }
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