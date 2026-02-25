import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Exam {
  return {
    id: row.id as string,
    classId: row.class_id as string,
    name: row.name as string,
    date: row.date as string,
    maxScore: row.max_score as number,
    type: row.type as Exam["type"],
    isPublished: row.is_published as boolean,
  };
}

export async function getExams(): Promise<Exam[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getExamsByClass(classId: string): Promise<Exam[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("class_id", classId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
