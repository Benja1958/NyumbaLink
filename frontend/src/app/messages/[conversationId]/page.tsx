"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

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

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadConversation() {
      try {
        const data =
          await getConversation(
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

    const formData =
      new FormData(form);

    const content =
      formData
        .get("content")
        ?.toString()
        .trim() ?? "";

    if (!content) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const message =
        await sendMessage(
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
          <p className="text-gray-500">
            Loading conversation...
          </p>

        ) : error && !conversation ? (

          <p className="text-red-600">
            {error}
          </p>

        ) : conversation && user ? (

          (() => {
            const otherPerson =
              user.role === "tenant"
                ? conversation.landlord
                : conversation.tenant;

            return (
              <>
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-gray-200 pb-5">

                  <img
                    src={
                      conversation.listing.image_url
                    }
                    alt={
                      conversation.listing.title
                    }
                    className="h-16 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h1 className="truncate text-xl font-semibold text-gray-900">
                      {
                        conversation.listing
                          .title
                      }
                    </h1>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {
                        otherPerson.full_name
                      }
                    </p>

                    <p className="text-xs capitalize text-gray-400">
                      {otherPerson.role}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold text-green-800">
                      KES{" "}
                      {conversation.listing.monthly_rent.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      /month
                    </p>

                  </div>
                </div>

                {/* Chat */}
                <div className="mt-6 flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">

                  {/* Messages */}
                  <div className="flex-1 space-y-3 bg-gray-50 px-5 py-6">

                    {conversation.messages.length ===
                    0 ? (

                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No messages yet. Start the conversation.
                      </div>

                    ) : (

                      conversation.messages.map(
                        (message) => {
                          const isMine =
                            message.sender_id ===
                            user.id;

                          return (
                            <div
                              key={
                                message.id
                              }
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
                                    : "border border-gray-200 bg-white text-gray-900"
                                }`}
                              >

                                <p className="leading-6">
                                  {
                                    message.content
                                  }
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
                      )

                    )}

                  </div>

                  {/* Message input */}
                  <div className="border-t border-gray-200 bg-white p-4">

                    {error && (
                      <p className="mb-3 text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    <form
                      onSubmit={
                        handleSubmit
                      }
                      className="flex gap-3"
                    >

                      <input
                        name="content"
                        type="text"
                        placeholder={`Message ${otherPerson.full_name}...`}
                        autoComplete="off"
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                      />

                      <button
                        type="submit"
                        disabled={sending}
                        className="rounded-xl bg-green-800 px-5 py-3 font-medium text-white hover:bg-green-900 disabled:opacity-50"
                      >
                        {sending
                          ? "Sending..."
                          : "Send"}
                      </button>

                    </form>

                  </div>

                </div>
              </>
            );
          })()

        ) : null}

      </main>
    </>
  );
}