"use client";

import {
  useEffect,
  useState,
} from "react";

import { MessageSquare } from "lucide-react";

import Navbar from "@/components/Navbar";
import ConversationCard from "@/components/ConversationCard";
import ConversationCardSkeleton from "@/components/ConversationCardSkeleton";
import EmptyState from "@/components/EmptyState";

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

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      try {
        const data =
          await getConversations();

        if (isMounted) {
          setConversations(data);
          setError("");
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load conversations"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    const interval = setInterval(
      loadConversations,
      MESSAGE_POLL_INTERVAL
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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
          <p className="mt-8 text-red-600">
            {error}
          </p>
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
                  conversation={conversation}
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