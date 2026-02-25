import { createClient } from "@/lib/supabase/server";
import type { Teacher } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Teacher {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    subject: row.subject as string,
    avatar: (row.avatar_url as string) ?? undefined,
  };
}

export async function getCurrentTeacher(): Promise<Teacher> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (error || !data) throw new Error("Teacher record not found");
  return mapRow(data);
}
