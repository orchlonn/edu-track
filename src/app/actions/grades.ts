"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateLetterGrade } from "@/lib/utils";

export async function saveGrades(
  examId: string,
  classId: string,
  entries: { studentId: string; score: number | null }[]
) {
  const supabase = await createClient();

  // Get exam max score
  const { data: exam } = await supabase
    .from("exams")
    .select("max_score")
    .eq("id", examId)
    .single();

  if (!exam) throw new Error("Exam not found");

  const { error } = await supabase
    .from("grade_entries")
    .upsert(
      entries.map((e) => ({
        student_id: e.studentId,
        exam_id: examId,
        class_id: classId,
        score: e.score,
        letter_grade: e.score !== null
          ? calculateLetterGrade(e.score, exam.max_score)
          : null,
        is_published: false,
      })),
      { onConflict: "student_id,exam_id" }
    );

  if (error) throw new Error(error.message);

  revalidatePath("/grades");
  revalidatePath("/");
}

export async function publishGrades(examId: string) {
  const supabase = await createClient();

  const { error: examError } = await supabase
    .from("exams")
    .update({ is_published: true })
    .eq("id", examId);

  if (examError) throw new Error(examError.message);

  const { error: gradeError } = await supabase
    .from("grade_entries")
    .update({ is_published: true })
    .eq("exam_id", examId);

  if (gradeError) throw new Error(gradeError.message);

  revalidatePath("/grades");
  revalidatePath("/");
}
