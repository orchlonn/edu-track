import { ActionItems } from "@/components/dashboard/action-items";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { AttendanceSummary } from "@/components/dashboard/attendance-summary";
import { ClassSnapshot } from "@/components/dashboard/class-snapshot";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import {
  getActionItems,
  getActivities,
  getTodaySchedule,
  getCurrentTeacher,
  getClasses,
  getStudents,
  getAllAttendanceRecords,
  getStudentAverageGrade,
  getStudentAttendanceRate,
  getClassById,
} from "@/lib/db";

export default async function DashboardPage() {
  const [teacher, actionItems, activities, todaySchedule, classes, students, attendanceRecords] =
    await Promise.all([
      getCurrentTeacher(),
      getActionItems(),
      getActivities(),
      getTodaySchedule(),
      getClasses(),
      getStudents(),
      getAllAttendanceRecords(),
    ]);

  // Resolve class info for schedule items
  const scheduleWithClasses = await Promise.all(
    todaySchedule.map(async (item) => ({
      ...item,
      className: (await getClassById(item.classId))?.name ?? "",
      classRoom: (await getClassById(item.classId))?.room ?? "",
    }))
  );

  // Pre-compute class snapshot stats
  const allStudentIds = new Set(classes.flatMap((c) => c.studentIds));
  const studentStats = await Promise.all(
    [...allStudentIds].map(async (id) => {
      const student = students.find((s) => s.id === id);
      const avg = await getStudentAverageGrade(id);
      const attendance = await getStudentAttendanceRate(id);
      return { student: student ?? null, avg, attendance };
    })
  );

  const validGrades = studentStats.filter((s) => s.avg !== null);
  const overallAvg = validGrades.length > 0
    ? Math.round(validGrades.reduce((sum, s) => sum + s.avg!, 0) / validGrades.length)
    : 0;

  const atRisk = studentStats.filter(
    (s) => (s.avg !== null && s.avg < 65) || s.attendance < 80
  );

  const topPerformers = studentStats.filter(
    (s) => s.avg !== null && s.avg >= 90
  ).length;

  // Pre-compute attendance summary
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = attendanceRecords.filter((r) => r.date === today);
  const lastDate = todayRecords.length > 0
    ? today
    : attendanceRecords.length > 0
      ? attendanceRecords[0].date
      : null;
  const dateRecords = lastDate
    ? attendanceRecords.filter((r) => r.date === lastDate)
    : [];

  const attendanceData = {
    present: dateRecords.filter((r) => r.status === "present").length,
    absent: dateRecords.filter((r) => r.status === "absent").length,
    late: dateRecords.filter((r) => r.status === "late").length,
    excused: dateRecords.filter((r) => r.status === "excused").length,
    total: dateRecords.length,
    totalStudents: allStudentIds.size,
  };

  const snapshotData = {
    overallAvg,
    atRisk: atRisk.slice(0, 3).map((s) => ({
      id: s.student?.id ?? "",
      firstName: s.student?.firstName ?? "",
      lastName: s.student?.lastName ?? "",
      avg: s.avg,
      attendance: s.attendance,
    })),
    atRiskCount: atRisk.length,
    topPerformers,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardGreeting teacherName={teacher.name} />
      <ActionItems items={actionItems} />
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaySchedule items={scheduleWithClasses} />
        <div className="space-y-6">
          <AttendanceSummary data={attendanceData} />
          <ClassSnapshot data={snapshotData} />
        </div>
      </div>
      <RecentActivity items={activities} />
    </div>
  );
}
