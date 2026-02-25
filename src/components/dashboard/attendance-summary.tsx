"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

interface AttendanceSummaryProps {
  data: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
    totalStudents: number;
  };
}

export function AttendanceSummary({ data }: AttendanceSummaryProps) {
  const { present, absent, late, total, totalStudents } = data;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <Card
      title="Attendance Today"
      action={
        <Link href="/attendance" className="text-xs font-medium text-blue-600 hover:text-blue-700">
          View Details
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-emerald-50 p-3">
          <UserCheck className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-lg font-bold text-emerald-700">{present}</p>
            <p className="text-xs text-emerald-600">Present</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-red-50 p-3">
          <UserX className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-lg font-bold text-red-700">{absent}</p>
            <p className="text-xs text-red-600">Absent</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-amber-50 p-3">
          <Clock className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-lg font-bold text-amber-700">{late}</p>
            <p className="text-xs text-amber-600">Late</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 p-3">
          <Users className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-lg font-bold text-gray-700">{totalStudents}</p>
            <p className="text-xs text-gray-600">Total Students</p>
          </div>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Attendance Rate</span>
            <span className="font-semibold text-gray-700">{rate}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
