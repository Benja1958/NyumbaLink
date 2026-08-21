import { authFetch } from "@/lib/authFetch";
import { ListingImage } from "@/types/listing";

export type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type LatestMessage = {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
};

export type Participant = {
  id: number;
  full_name: string;
  role: "tenant" | "landlord";
};

export type ConversationListing = {
  id: number;
  title: string;
  location: string;
  image_url: string | null;
  images: ListingImage[];
  monthly_rent: number;
};

export type Conversation = {
  id: number;
  listing_id: number;
  tenant_id: number;
  landlord_id: number;
  created_at: string;

  listing: ConversationListing;
  tenant: Participant;
  landlord: Participant;

  latest_message: LatestMessage | null;
  unread_count: number;
};

export type ConversationWithMessages =
  Conversation & {
    messages: Message[];
  };

export const MESSAGE_POLL_INTERVAL = 7000;

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data =
      await response.json();

    if (
      typeof data.detail ===
      "string"
    ) {
      return data.detail;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function createConversation(
  listingId: number
): Promise<Conversation> {
  const response = await authFetch(
    "/backend-api/messages/conversations",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        listing_id: listingId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to start conversation"
      )
    );
  }

  return response.json();
}

export async function getConversations(): Promise<
  Conversation[]
> {
  const response = await authFetch(
    "/backend-api/messages/conversations"
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load conversations"
      )
    );
  }

  return response.json();
}

export async function getConversation(
  conversationId: number
): Promise<ConversationWithMessages> {
  const response = await authFetch(
    `/backend-api/messages/conversations/${conversationId}`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load conversation"
      )
    );
  }

  return response.json();
}

export async function sendMessage(
  conversationId: number,
  content: string
): Promise<Message> {
  const response = await authFetch(
    `/backend-api/messages/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to send message"
      )
    );
  }

  return response.json();
}
