"use client";

import {
  useEffect,
  useState,
} from "react";

import { MessageSquare } from "lucide-react";

import Navbar from "@/components/Navbar";
import ConversationCard from "@/components/ConversationCard";

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

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      try {
        const data = await getConversations();

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
            Conversations about properties you&apos;re interested in.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-gray-500">
            Loading conversations...
          </p>
        ) : error ? (
          <p className="mt-10 text-red-600">
            {error}
          </p>
        ) : conversations.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-lg font-semibold">
              No conversations yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start a conversation from a property page.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {conversations.map(
              (conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
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