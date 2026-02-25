import { createClient } from "@/lib/supabase/server";
import type { Class } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Class {
  const classStudents = (row.class_students ?? []) as { student_id: string }[];
  return {
    id: row.id as string,
    name: row.name as string,
    subject: row.subject as string,
    grade: row.grade as string,
    room: row.room as string,
    studentIds: classStudents.map((cs) => cs.student_id),
  };
}

export async function getClasses(): Promise<Class[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*, class_students(student_id)")
    .order("name");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getClassById(id: string): Promise<Class | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*, class_students(student_id)")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapRow(data);
}
