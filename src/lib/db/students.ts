import { createClient } from "@/lib/supabase/server";
import type { Student } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Student {
  const classStudents = (row.class_students ?? []) as { class_id: string }[];
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    avatar: (row.avatar_url as string) ?? undefined,
    grade: row.grade as string,
    classIds: classStudents.map((cs) => cs.class_id),
    parentName: row.parent_name as string,
    parentPhone: row.parent_phone as string,
    parentEmail: row.parent_email as string,
    enrollmentDate: row.enrollment_date as string,
  };
}

export async function getStudents(): Promise<Student[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, class_students(class_id)")
    .order("last_name");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, class_students(class_id)")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapRow(data);
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, class_students!inner(class_id)")
    .eq("class_students.class_id", classId)
    .order("last_name");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
