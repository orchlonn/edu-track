"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentTeacher } from "@/lib/db";

export async function sendReply(messageId: string, content: string) {
  const supabase = await createClient();
  const teacher = await getCurrentTeacher();

  const { error: itemError } = await supabase
    .from("message_items")
    .insert({
      message_id: messageId,
      sender_name: teacher.name,
      content,
      is_from_teacher: true,
    });

  if (itemError) throw new Error(itemError.message);

  // Update thread metadata
  const { error: msgError } = await supabase
    .from("messages")
    .update({
      last_message_at: new Date().toISOString(),
      is_read: true,
    })
    .eq("id", messageId);

  if (msgError) throw new Error(msgError.message);

  revalidatePath("/messages");
}

export async function markMessageRead(messageId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId);

  if (error) throw new Error(error.message);

  revalidatePath("/messages");
}
