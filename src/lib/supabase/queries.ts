import { createClient } from "./client";
import type {
  Class,
  Student,
  AttendanceRecord,
  Exam,
  GradeEntry,
} from "@/lib/types";
import { calculateLetterGrade } from "@/lib/utils";

const supabase = createClient();

// ─── Classes ─────────────────────────────────────────
export async function fetchClasses(): Promise<Class[]> {
  const { data } = await supabase
    .from("classes")
    .select("*, class_students(student_id)")
    .order("name");

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    subject: row.subject,
    grade: row.grade,
    room: row.room,
    studentIds: (row.class_students ?? []).map((cs: { student_id: string }) => cs.student_id),
  }));
}

// ─── Students ────────────────────────────────────────
export async function fetchStudentsByClass(classId: string): Promise<Student[]> {
  const { data } = await supabase
    .from("students")
    .select("*, class_students!inner(class_id)")
    .eq("class_students.class_id", classId)
    .order("last_name");

  return (data ?? []).map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    avatar: row.avatar_url ?? undefined,
    grade: row.grade,
    classIds: (row.class_students ?? []).map((cs: { class_id: string }) => cs.class_id),
    parentName: row.parent_name,
    parentPhone: row.parent_phone,
    parentEmail: row.parent_email,
    enrollmentDate: row.enrollment_date,
  }));
}

export async function fetchStudents(): Promise<Student[]> {
  const { data } = await supabase
    .from("students")
    .select("*, class_students(class_id)")
    .order("last_name");

  return (data ?? []).map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    avatar: row.avatar_url ?? undefined,
    grade: row.grade,
    classIds: (row.class_students ?? []).map((cs: { class_id: string }) => cs.class_id),
    parentName: row.parent_name,
    parentPhone: row.parent_phone,
    parentEmail: row.parent_email,
    enrollmentDate: row.enrollment_date,
  }));
}

// ─── Attendance ──────────────────────────────────────
export async function fetchAttendanceForClassDate(
  classId: string,
  date: string
): Promise<AttendanceRecord[]> {
  const { data } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("class_id", classId)
    .eq("date", date);

  return (data ?? []).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    classId: row.class_id,
    date: row.date,
    status: row.status,
    note: row.note ?? undefined,
  }));
}

export async function fetchAllAttendanceRecords(): Promise<AttendanceRecord[]> {
  const { data } = await supabase
    .from("attendance_records")
    .select("*")
    .order("date", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    classId: row.class_id,
    date: row.date,
    status: row.status,
    note: row.note ?? undefined,
  }));
}

// ─── Exams ───────────────────────────────────────────
export async function fetchExamsByClass(classId: string): Promise<Exam[]> {
  const { data } = await supabase
    .from("exams")
    .select("*")
    .eq("class_id", classId)
    .order("date", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    classId: row.class_id,
    name: row.name,
    date: row.date,
    maxScore: row.max_score,
    type: row.type,
    isPublished: row.is_published,
  }));
}

// ─── Grade Entries ───────────────────────────────────
export async function fetchGradeEntriesForExam(examId: string): Promise<GradeEntry[]> {
  const { data } = await supabase
    .from("grade_entries")
    .select("*")
    .eq("exam_id", examId);

  return (data ?? []).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    examId: row.exam_id,
    classId: row.class_id,
    score: row.score,
    letterGrade: row.letter_grade,
    isPublished: row.is_published,
  }));
}

export async function fetchGradeEntriesForStudent(studentId: string): Promise<GradeEntry[]> {
  const { data } = await supabase
    .from("grade_entries")
    .select("*")
    .eq("student_id", studentId);

  return (data ?? []).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    examId: row.exam_id,
    classId: row.class_id,
    score: row.score,
    letterGrade: row.letter_grade,
    isPublished: row.is_published,
  }));
}

// ─── Computed helpers ────────────────────────────────
export async function fetchStudentAverageGrade(
  studentId: string,
  classId?: string
): Promise<number | null> {
  let query = supabase
    .from("grade_entries")
    .select("score, exams(max_score)")
    .eq("student_id", studentId)
    .eq("is_published", true)
    .not("score", "is", null);

  if (classId) query = query.eq("class_id", classId);

  const { data } = await query;
  if (!data || data.length === 0) return null;

  let totalPct = 0;
  for (const entry of data) {
    const exam = entry.exams as unknown as { max_score: number };
    totalPct += ((entry.score as number) / exam.max_score) * 100;
  }
  return Math.round(totalPct / data.length);
}

export async function fetchStudentAttendanceRate(studentId: string): Promise<number> {
  const { data } = await supabase
    .from("attendance_records")
    .select("status")
    .eq("student_id", studentId);

  if (!data || data.length === 0) return 100;
  const present = data.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / data.length) * 100);
}

export async function fetchAttendanceDailyBreakdown(
  classId: string
): Promise<{ date: string; present: number; absent: number; late: number; excused: number }[]> {
  const { data } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("class_id", classId)
    .order("date");

  if (!data) return [];

  const byDate = new Map<string, typeof data>();
  for (const row of data) {
    const existing = byDate.get(row.date) ?? [];
    existing.push(row);
    byDate.set(row.date, existing);
  }

  return [...byDate.entries()].map(([date, records]) => ({
    date,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
  }));
}

export async function fetchGradeDistributionByClass(
  classId: string
): Promise<{ A: number; B: number; C: number; D: number; F: number }> {
  const { data: csData } = await supabase
    .from("class_students")
    .select("student_id")
    .eq("class_id", classId);

  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  if (!csData) return dist;

  for (const { student_id } of csData) {
    const avg = await fetchStudentAverageGrade(student_id, classId);
    if (avg === null) continue;
    if (avg >= 90) dist.A++;
    else if (avg >= 80) dist.B++;
    else if (avg >= 70) dist.C++;
    else if (avg >= 60) dist.D++;
    else dist.F++;
  }
  return dist;
}
