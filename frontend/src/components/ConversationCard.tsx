import Link from "next/link";

import {
  MapPin,
  MessageSquare,
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

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
    >
      <img
        src={conversation.listing.image_url}
        alt={conversation.listing.title}
        className="h-20 w-24 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-gray-900">
              {conversation.listing.title}
            </h2>

            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {conversation.listing.location}
              </span>
            </div>
          </div>

          <MessageSquare className="h-5 w-5 shrink-0 text-gray-400" />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {otherPerson.full_name}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {otherPerson.role}
            </p>
          </div>

          <p className="text-sm font-semibold text-green-800">
            KES{" "}
            {conversation.listing.monthly_rent.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}