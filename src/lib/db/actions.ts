import { createClient } from "@/lib/supabase/server";
import type { ActionItem } from "@/lib/types";

function mapRow(row: Record<string, unknown>): ActionItem {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as ActionItem["type"],
    priority: row.priority as ActionItem["priority"],
    link: row.link as string,
    isCompleted: row.is_completed as boolean,
  };
}

export async function getActionItems(): Promise<ActionItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("action_items")
    .select("*")
    .eq("is_completed", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
