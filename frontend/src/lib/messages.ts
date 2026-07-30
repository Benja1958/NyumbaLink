export type Message = {
  id: number;
  conversation_id: number;
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
  image_url: string;
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
};

export type ConversationWithMessages =
  Conversation & {
    messages: Message[];
  };

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

function getToken(): string {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You must be logged in");
  }

  return token;
}

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
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
  const token = getToken();

  const response = await fetch(
    `${API_URL}/messages/conversations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const token = getToken();

  const response = await fetch(
    `${API_URL}/messages/conversations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const token = getToken();

  const response = await fetch(
    `${API_URL}/messages/conversations/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const token = getToken();

  const response = await fetch(
    `${API_URL}/messages/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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