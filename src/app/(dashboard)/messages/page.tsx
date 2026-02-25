import { getMessages } from "@/lib/db";
import { MessagesClient } from "@/components/messages/messages-client";

export default async function MessagesPage() {
  const initialMessages = await getMessages();

  return (
    <div className="mx-auto max-w-5xl">
      <MessagesClient initialMessages={initialMessages} />
    </div>
  );
}
