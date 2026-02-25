import { createClient } from "@/lib/supabase/server";
import type { GradeEntry } from "@/lib/types";

function mapRow(row: Record<string, unknown>): GradeEntry {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    examId: row.exam_id as string,
    classId: row.class_id as string,
    score: row.score as number | null,
    letterGrade: row.letter_grade as GradeEntry["letterGrade"],
    isPublished: row.is_published as boolean,
  };
}

export async function getGradeEntriesForExam(examId: string): Promise<GradeEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grade_entries")
    .select("*")
    .eq("exam_id", examId);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getGradeEntriesForStudent(studentId: string): Promise<GradeEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grade_entries")
    .select("*")
    .eq("student_id", studentId);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getStudentAverageGrade(
  studentId: string,
  classId?: string
): Promise<number | null> {
  const supabase = await createClient();

  let query = supabase
    .from("grade_entries")
    .select("score, exams(max_score)")
    .eq("student_id", studentId)
    .eq("is_published", true)
    .not("score", "is", null);

  if (classId) query = query.eq("class_id", classId);

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;

  let totalPct = 0;
  for (const entry of data) {
    const exam = entry.exams as unknown as { max_score: number };
    totalPct += ((entry.score as number) / exam.max_score) * 100;
  }
  return Math.round(totalPct / data.length);
}

export async function getGradeDistributionByClass(
  classId: string
): Promise<{ A: number; B: number; C: number; D: number; F: number }> {
  const supabase = await createClient();

  // Get all students in this class
  const { data: csData } = await supabase
    .from("class_students")
    .select("student_id")
    .eq("class_id", classId);

  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  if (!csData) return dist;

  for (const { student_id } of csData) {
    const avg = await getStudentAverageGrade(student_id, classId);
    if (avg === null) continue;
    if (avg >= 90) dist.A++;
    else if (avg >= 80) dist.B++;
    else if (avg >= 70) dist.C++;
    else if (avg >= 60) dist.D++;
    else dist.F++;
  }
  return dist;
}
