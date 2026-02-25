"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentTeacher } from "@/lib/db";

export async function addNote(studentId: string, content: string) {
  const supabase = await createClient();
  const teacher = await getCurrentTeacher();

  const { error } = await supabase
    .from("teacher_notes")
    .insert({
      teacher_id: teacher.id,
      student_id: studentId,
      content,
    });

  if (error) throw new Error(error.message);

  revalidatePath(`/students/${studentId}`);
}
