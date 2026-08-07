"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import ConversationPageSkeleton from "@/components/ConversationPageSkeleton";

import {
  ConversationWithMessages,
  getConversation,
  MESSAGE_POLL_INTERVAL,
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
    let isMounted = true;

    async function loadConversation() {
      try {
        const data =
          await getConversation(
            conversationId
          );

        if (isMounted) {
          setConversation(data);
          setError("");
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load conversation"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConversation();

    const interval = setInterval(
      loadConversation,
      MESSAGE_POLL_INTERVAL
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);

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

        const alreadyExists =
          current.messages.some(
            (existing) =>
              existing.id === message.id
          );

        if (alreadyExists) {
          return current;
        }

        return {
          ...current,
          messages: [
            ...current.messages,
            message,
          ],
          latest_message: {
            id: message.id,
            sender_id:
              message.sender_id,
            content:
              message.content,
            created_at:
              message.created_at,
          },
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

  if (loading) {
    return (
      <>
        <Navbar />
        <ConversationPageSkeleton />
      </>
    );
  }

  if (!conversation) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-red-600">
            {error ||
              "Conversation not found"}
          </p>
        </main>
      </>
    );
  }

  const otherPerson =
    user?.role === "tenant"
      ? conversation.landlord
      : conversation.tenant;

  const coverImage =
    conversation.listing.images?.find(
      (image) => image.is_cover
    )?.image_url ??
    conversation.listing.images?.[0]
      ?.image_url ??
    conversation.listing.image_url;

  const messagesHref =
    user?.role === "landlord"
      ? "/landlord/messages"
      : "/tenant/messages";

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href={messagesHref}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Messages
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <header className="border-b border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <img
                src={coverImage ?? ""}
                alt={
                  conversation.listing.title
                }
                className="h-16 w-20 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold text-gray-900">
                  {
                    conversation.listing
                      .title
                  }
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                  {otherPerson.full_name}
                </p>

                <p className="text-xs capitalize text-gray-400">
                  {otherPerson.role}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-green-800">
                  KES{" "}
                  {conversation.listing
                    .monthly_rent
                    .toLocaleString()}
                </p>

                <p className="text-xs text-gray-500">
                  /month
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href={`/listings/${conversation.listing.id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View Property →
              </Link>
            </div>
          </header>

          <div className="flex min-h-[520px] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {conversation.messages.map(
                (message) => {
                  const isMine =
                    message.sender_id ===
                    user?.id;

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
                        <p className="leading-6">
                          {message.content}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isMine
                              ? "text-white/70"
                              : "text-gray-400"
                          }`}
                        >
                          {formatMessageTime(
                            message.created_at
                          )}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {error && (
              <p className="px-5 pb-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex gap-3 border-t border-gray-200 p-4"
            >
              <input
                name="content"
                type="text"
                placeholder="Type a message..."
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
      </main>
    </>
  );
}

function formatMessageTime(
  value: string
): string {
  const date = new Date(value);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const differenceInDays = Math.round(
    (today.getTime() -
      messageDay.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const time =
    date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  if (differenceInDays === 0) {
    return time;
  }

  if (differenceInDays === 1) {
    return `Yesterday, ${time}`;
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}