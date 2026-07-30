"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

import {
  ConversationWithMessages,
  getConversation,
  sendMessage,
} from "@/lib/messages";

export default function ConversationPage() {
  const params = useParams();
  const { user } = useAuth();

  const conversationId = Number(
    params.conversationId
  );

  const [conversation, setConversation] =
    useState<ConversationWithMessages | null>(
      null
    );

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConversation() {
      try {
        const data = await getConversation(
          conversationId
        );

        setConversation(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load conversation"
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [conversationId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const content =
      formData.get("content")?.toString().trim() ??
      "";

    if (!content) {
      return;
    }

    try {
      setSending(true);

      const message = await sendMessage(
        conversationId,
        content
      );

      setConversation((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          messages: [
            ...current.messages,
            message,
          ],
        };
      });

      form.reset();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        {loading ? (
          <p>Loading conversation...</p>
        ) : error && !conversation ? (
          <p className="text-red-600">
            {error}
          </p>
        ) : conversation ? (
          <>
            <div className="border-b pb-5">
              <h1 className="text-2xl font-bold">
                Property #{conversation.listing_id}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Conversation #{conversation.id}
              </p>
            </div>

            <div className="flex min-h-[500px] flex-col">
              <div className="flex-1 space-y-4 py-6">
                {conversation.messages.map(
                  (message) => {
                    const isMine =
                      message.sender_id === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isMine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            isMine
                              ? "bg-green-800 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p>
                            {message.content}
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              isMine
                                ? "text-white/70"
                                : "text-gray-400"
                            }`}
                          >
                            {new Date(
                              message.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {error && (
                <p className="mb-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex gap-3 border-t pt-4"
              >
                <input
                  name="content"
                  type="text"
                  placeholder="Type a message..."
                  autoComplete="off"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3"
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-lg bg-green-800 px-5 py-3 font-medium text-white disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}