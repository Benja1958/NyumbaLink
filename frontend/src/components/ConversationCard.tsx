import Link from "next/link";

import {
  MapPin,
} from "lucide-react";

import { Conversation } from "@/lib/messages";

type ConversationCardProps = {
  conversation: Conversation;
  viewerRole: "tenant" | "landlord";
};

export default function ConversationCard({
  conversation,
  viewerRole,
}: ConversationCardProps) {
  const otherPerson =
    viewerRole === "tenant"
      ? conversation.landlord
      : conversation.tenant;

  const coverImage =
    conversation.listing.images?.find(
      (image) => image.is_cover
    )?.image_url ??
    conversation.listing.images?.[0]?.image_url ??
    conversation.listing.image_url;

  const latestMessage =
    conversation.latest_message;

  const latestMessageIsMine =
    latestMessage?.sender_id ===
    (viewerRole === "tenant"
      ? conversation.tenant_id
      : conversation.landlord_id);

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex gap-4">
        <img
          src={coverImage ?? ""}
          alt={conversation.listing.title}
          className="h-24 w-28 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2
                className={`truncate ${
                  conversation.unread_count > 0
                    ? "font-bold text-gray-950"
                    : "font-semibold text-gray-900"
                }`}
              >
                {conversation.listing.title}
              </h2>

              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate">
                  {conversation.listing.location}
                </span>
              </div>
            </div>

            {latestMessage && (
              <span
                className={`shrink-0 text-xs ${
                  conversation.unread_count > 0
                    ? "font-semibold text-green-700"
                    : "text-gray-500"
                }`}
              >
                {formatConversationTime(
                  latestMessage.created_at
                )}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700">
                {otherPerson.full_name}
              </p>

              {latestMessage ? (
                <p
                  className={`mt-1 truncate text-sm ${
                    conversation.unread_count > 0
                      ? "font-medium text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {latestMessageIsMine
                    ? "You: "
                    : `${otherPerson.full_name}: `}

                  {latestMessage.content}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-400">
                  No messages yet
                </p>
              )}
            </div>

            {conversation.unread_count > 0 && (
              <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-green-700 px-2 text-xs font-semibold text-white">
                {conversation.unread_count}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm font-semibold text-green-800">
            KES{" "}
            {conversation.listing.monthly_rent.toLocaleString()}
            <span className="font-normal text-gray-500">
              /month
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

function formatConversationTime(
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

  if (differenceInDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (differenceInDays === 1) {
    return "Yesterday";
  }

  if (
    differenceInDays > 1 &&
    differenceInDays < 7
  ) {
    return date.toLocaleDateString([], {
      weekday: "short",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}