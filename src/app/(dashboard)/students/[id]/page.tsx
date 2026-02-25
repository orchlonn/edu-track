import { StudentProfile } from "@/components/students/student-profile";
import {
  getStudentById,
  getStudentAverageGrade,
  getStudentAttendanceRate,
  getGradeEntriesForStudent,
  getAttendanceForStudent,
  getNotesForStudent,
} from "@/lib/db";
import { getExams, getClasses } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentProfilePage({ params }: Props) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  const [overallAvg, attendance, gradeEntries, attendanceRecords, notes, exams, classes] =
    await Promise.all([
      getStudentAverageGrade(student.id),
      getStudentAttendanceRate(student.id),
      getGradeEntriesForStudent(student.id),
      getAttendanceForStudent(student.id),
      getNotesForStudent(student.id),
      getExams(),
      getClasses(),
    ]);

  // Per-class averages
  const classAverages = await Promise.all(
    student.classIds.map(async (classId) => {
      const cls = classes.find((c) => c.id === classId);
      const avg = await getStudentAverageGrade(student.id, classId);
      return { cls: cls ?? null, avg };
    })
  );

  return (
    <StudentProfile
      student={student}
      overallAvg={overallAvg}
      attendance={attendance}
      classAverages={classAverages}
      gradeEntries={gradeEntries}
      attendanceRecords={attendanceRecords}
      notes={notes}
      exams={exams}
      classes={classes}
    />
  );
}
