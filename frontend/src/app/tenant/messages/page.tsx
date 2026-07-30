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
} from "@/lib/messages";

export default function TenantMessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadConversations() {
      try {
        const data =
          await getConversations();

        setConversations(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load conversations"
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
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