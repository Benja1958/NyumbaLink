"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";
import ConversationPageSkeleton from "@/components/ConversationPageSkeleton";

import { useAuth } from "@/context/AuthContext";

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

  const hasLoadedOnce =
    useRef(false);

  const loadConversation = useCallback(
    async (
      showLoading = false
    ) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError("");

        const data =
          await getConversation(
            conversationId
          );

        setConversation(data);

        hasLoadedOnce.current =
          true;
      } catch (error) {
        if (!hasLoadedOnce.current) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load conversation"
          );
        } else {
          console.error(
            "Failed to refresh conversation:",
            error
          );
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [conversationId]
  );

  useEffect(() => {
    loadConversation(true);

    const interval =
      setInterval(
        () => {
          loadConversation(false);
        },
        MESSAGE_POLL_INTERVAL
      );

    return () => {
      clearInterval(interval);
    };
  }, [
    loadConversation,
  ]);

  async function handleRetry() {
    hasLoadedOnce.current = false;

    await loadConversation(true);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form =
      event.currentTarget;

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
              existing.id ===
              message.id
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

  if (
    error &&
    !conversation
  ) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-3xl px-6 py-20">
          <ErrorState
            title="Couldn't load conversation"
            description="We had trouble loading this conversation. Check your connection and try again."
            onRetry={
              handleRetry
            }
          />
        </main>
      </>
    );
  }

  if (!conversation) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-3xl px-6 py-20">
          <ErrorState
            title="Conversation unavailable"
            description="This conversation could not be found or may no longer be available."
            onRetry={
              handleRetry
            }
          />
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
      (image) =>
        image.is_cover
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
                  conversation.listing
                    .title
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
                  {
                    otherPerson.full_name
                  }
                </p>

                <p className="text-xs capitalize text-gray-400">
                  {
                    otherPerson.role
                  }
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
              {conversation.messages.length ===
              0 ? (
                <div className="flex min-h-[350px] items-center justify-center">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      No messages yet
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Send the first message
                      to start the
                      conversation.
                    </p>
                  </div>
                </div>
              ) : (
                conversation.messages.map(
                  (message) => {
                    const isMine =
                      message.sender_id ===
                      user?.id;

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
                              : "bg-gray-100 text-gray-900"
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
                            {formatMessageTime(
                              message.created_at
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>

            {error &&
              conversation && (
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
                className="rounded-xl bg-green-800 px-5 py-3 font-medium text-white hover:bg-green-900 disabled:pointer-events-none disabled:opacity-50"
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
  const date =
    new Date(value);

  const now =
    new Date();

  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const messageDay =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  const differenceInDays =
    Math.round(
      (
        today.getTime() -
        messageDay.getTime()
      ) /
        (
          1000 *
          60 *
          60 *
          24
        )
    );

  const time =
    date.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  if (
    differenceInDays === 0
  ) {
    return time;
  }

  if (
    differenceInDays === 1
  ) {
    return `Yesterday, ${time}`;
  }

  return date.toLocaleString(
    [],
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}