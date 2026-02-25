"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type Student } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface StudentCardProps {
  student: Student;
  avg: number | null;
  attendance: number;
}

export function StudentCard({ student, avg, attendance }: StudentCardProps) {
  const isAtRisk = (avg !== null && avg < 65) || attendance < 80;

  return (
    <Link
      href={`/students/${student.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 transition-all hover:border-blue-200 hover:shadow-sm"
    >
      <Avatar firstName={student.firstName} lastName={student.lastName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-800">
            {student.lastName}, {student.firstName}
          </p>
          {isAtRisk && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />}
        </div>
        <p className="text-xs text-gray-500">{student.grade} Grade</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={avg !== null && avg >= 70 ? "success" : avg !== null ? "danger" : "neutral"}>
          {avg !== null ? `${avg}%` : "N/A"}
        </Badge>
        <Badge variant={attendance >= 90 ? "success" : attendance >= 80 ? "warning" : "danger"}>
          {attendance}%
        </Badge>
      </div>
    </Link>
  );
}
