import { createClient } from "@/lib/supabase/server";
import type { AttendanceRecord } from "@/lib/types";

function mapRow(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    classId: row.class_id as string,
    date: row.date as string,
    status: row.status as AttendanceRecord["status"],
    note: (row.note as string) ?? undefined,
  };
}

export async function getAttendanceForClassDate(
  classId: string,
  date: string
): Promise<AttendanceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("class_id", classId)
    .eq("date", date);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getAttendanceForStudent(
  studentId: string
): Promise<AttendanceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getStudentAttendanceRate(studentId: string): Promise<number> {
  const records = await getAttendanceForStudent(studentId);
  if (records.length === 0) return 100;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / records.length) * 100);
}

export async function getAttendanceDailyBreakdown(
  classId: string
): Promise<{ date: string; present: number; absent: number; late: number; excused: number }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("class_id", classId)
    .order("date");

  if (error) throw error;

  const byDate = new Map<string, AttendanceRecord[]>();
  for (const row of (data ?? []).map(mapRow)) {
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
