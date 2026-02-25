"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AlertTriangle, ArrowRight } from "lucide-react";
import {
  fetchStudents,
  fetchClasses,
  fetchStudentAverageGrade,
  fetchStudentAttendanceRate,
} from "@/lib/supabase/queries";
import type { Student, Class } from "@/lib/types";

interface StudentStats {
  student: Student;
  avg: number | null;
  attendance: number;
  studentClasses: string;
}

export function AtRiskStudents() {
  const [gradeThreshold, setGradeThreshold] = useState(65);
  const [attendanceThreshold, setAttendanceThreshold] = useState(80);
  const [allStats, setAllStats] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [studentList, classList] = await Promise.all([fetchStudents(), fetchClasses()]);
      const stats: StudentStats[] = await Promise.all(
        studentList.map(async (student) => {
          const [avg, attendance] = await Promise.all([
            fetchStudentAverageGrade(student.id),
            fetchStudentAttendanceRate(student.id),
          ]);
          const studentClasses = student.classIds
            .map((id) => classList.find((c) => c.id === id)?.name)
            .filter(Boolean)
            .join(", ");
          return { student, avg, attendance, studentClasses };
        })
      );
      setAllStats(stats);
      setLoading(false);
    }
    load();
  }, []);

  const atRiskList = useMemo(() => {
    return allStats
      .map((s) => {
        const isLowGrade = s.avg !== null && s.avg < gradeThreshold;
        const isLowAttendance = s.attendance < attendanceThreshold;
        return { ...s, isLowGrade, isLowAttendance, isAtRisk: isLowGrade || isLowAttendance };
      })
      .filter((s) => s.isAtRisk)
      .sort((a, b) => {
        const aFlags = (a.isLowGrade ? 1 : 0) + (a.isLowAttendance ? 1 : 0);
        const bFlags = (b.isLowGrade ? 1 : 0) + (b.isLowAttendance ? 1 : 0);
        if (aFlags !== bFlags) return bFlags - aFlags;
        return (a.avg ?? 0) - (b.avg ?? 0);
      });
  }, [allStats, gradeThreshold, attendanceThreshold]);

  if (loading) {
    return <p className="py-8 text-center text-sm text-gray-500">Loading at-risk data...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Threshold controls */}
      <Card title="Risk Thresholds">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Grade below</label>
            <input
              type="number"
              min={0}
              max={100}
              value={gradeThreshold}
              onChange={(e) => setGradeThreshold(Number(e.target.value))}
              className="h-9 w-20 rounded-lg border border-gray-300 px-2 text-center text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Attendance below</label>
            <input
              type="number"
              min={0}
              max={100}
              value={attendanceThreshold}
              onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
              className="h-9 w-20 rounded-lg border border-gray-300 px-2 text-center text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <Badge variant={atRiskList.length > 0 ? "danger" : "success"}>
            {atRiskList.length} student{atRiskList.length !== 1 ? "s" : ""} flagged
          </Badge>
        </div>
      </Card>

      {/* Student list */}
      {atRiskList.length > 0 ? (
        <div className="space-y-2">
          {atRiskList.map(({ student, avg, attendance, studentClasses, isLowGrade, isLowAttendance }) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 transition-all hover:border-red-200 hover:shadow-sm"
            >
              <Avatar firstName={student.firstName} lastName={student.lastName} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {student.lastName}, {student.firstName}
                  </p>
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                </div>
                <p className="text-xs text-gray-500">{studentClasses}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {isLowGrade && (
                  <Badge variant="danger">Grade: {avg ?? "N/A"}%</Badge>
                )}
                {isLowAttendance && (
                  <Badge variant="warning">Attend: {attendance}%</Badge>
                )}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <AlertTriangle className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">No at-risk students</p>
            <p className="mt-1 text-xs text-gray-500">
              All students are above the current thresholds. Try adjusting the thresholds to see more results.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
