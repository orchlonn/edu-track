import { createClient } from "@/lib/supabase/server";
import type { Message, MessageItem } from "@/lib/types";

function mapMessageItem(row: Record<string, unknown>): MessageItem {
  return {
    id: row.id as string,
    senderName: row.sender_name as string,
    content: row.content as string,
    sentAt: row.sent_at as string,
    isFromTeacher: row.is_from_teacher as boolean,
  };
}

function mapRow(row: Record<string, unknown>): Message {
  const items = (row.message_items ?? []) as Record<string, unknown>[];
  const student = row.students as Record<string, unknown> | null;
  const thread = items.map(mapMessageItem).sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );
  const lastItem = thread[thread.length - 1];

  return {
    id: row.id as string,
    parentName: row.parent_name as string,
    studentId: row.student_id as string,
    studentName: student
      ? `${student.first_name} ${student.last_name}`
      : "",
    subject: row.subject as string,
    preview: lastItem ? lastItem.content.slice(0, 60) + "..." : "",
    lastMessageAt: row.last_message_at as string,
    isRead: row.is_read as boolean,
    thread,
  };
}

export async function getMessages(): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*, message_items(*), students(first_name, last_name)")
    .order("last_message_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getMessagesForStudent(studentId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*, message_items(*), students(first_name, last_name)")
    .eq("student_id", studentId)
    .order("last_message_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw error;
  return count ?? 0;
}
