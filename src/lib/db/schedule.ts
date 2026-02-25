import { createClient } from "@/lib/supabase/server";
import type { ScheduleItem } from "@/lib/types";

function mapRow(row: Record<string, unknown>): ScheduleItem {
  return {
    id: row.id as string,
    classId: row.class_id as string,
    period: row.period as number,
    startTime: (row.start_time as string).slice(0, 5), // "08:00:00" -> "08:00"
    endTime: (row.end_time as string).slice(0, 5),
    dayOfWeek: row.day_of_week as number,
  };
}

export async function getScheduleForDay(dayOfWeek: number): Promise<ScheduleItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule_items")
    .select("*")
    .eq("day_of_week", dayOfWeek)
    .order("period");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getTodaySchedule(): Promise<ScheduleItem[]> {
  const today = new Date().getDay();
  return getScheduleForDay(today);
}
