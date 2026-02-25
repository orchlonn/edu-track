import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    description: row.description as string,
    timestamp: row.created_at as string,
    type: row.type as Activity["type"],
  };
}

export async function getActivities(): Promise<Activity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
