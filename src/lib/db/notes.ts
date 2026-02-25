import { createClient } from "@/lib/supabase/server";
import type { TeacherNote } from "@/lib/types";

function mapRow(row: Record<string, unknown>): TeacherNote {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    content: row.content as string,
    createdAt: row.created_at as string,
  };
}

export async function getNotesForStudent(studentId: string): Promise<TeacherNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teacher_notes")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
