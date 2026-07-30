"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

import Navbar from "@/components/Navbar";
import {
  Conversation,
  getConversations,
} from "@/lib/messages";

export default function TenantMessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();
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
        <h1 className="text-3xl font-bold">
          Messages
        </h1>

        <p className="mt-2 text-gray-600">
          Conversations about properties you're interested in.
        </p>

        {loading ? (
          <p className="mt-8 text-gray-500">
            Loading conversations...
          </p>
        ) : error ? (
          <p className="mt-8 text-red-600">
            {error}
          </p>
        ) : conversations.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed p-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />

            <h2 className="mt-4 font-semibold">
              No conversations yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start a conversation from a property page.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block rounded-xl border bg-white p-5 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      Property #{conversation.listing_id}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Conversation with landlord
                    </p>
                  </div>

                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}