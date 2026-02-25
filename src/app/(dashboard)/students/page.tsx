import { getStudents, getClasses, getStudentAverageGrade, getStudentAttendanceRate } from "@/lib/db";
import { StudentList } from "@/components/students/student-list";

export default async function StudentsPage() {
  const [students, classes] = await Promise.all([
    getStudents(),
    getClasses(),
  ]);

  // Pre-compute stats for each student
  const studentStats = await Promise.all(
    students.map(async (s) => ({
      id: s.id,
      avg: await getStudentAverageGrade(s.id),
      attendance: await getStudentAttendanceRate(s.id),
    }))
  );

  const statsMap = Object.fromEntries(
    studentStats.map((s) => [s.id, { avg: s.avg, attendance: s.attendance }])
  );

  return (
    <div className="mx-auto max-w-3xl">
      <StudentList students={students} classes={classes} statsMap={statsMap} />
    </div>
  );
}
