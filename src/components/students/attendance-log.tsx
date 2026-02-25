"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getAttendanceLabel } from "@/lib/utils";
import { type AttendanceStatus, type AttendanceRecord } from "@/lib/types";

const statusVariant: Record<AttendanceStatus, "success" | "danger" | "warning" | "info"> = {
  present: "success",
  absent: "danger",
  late: "warning",
  excused: "info",
};

interface AttendanceLogProps {
  records: AttendanceRecord[];
}

export function AttendanceLog({ records: rawRecords }: AttendanceLogProps) {
  const records = useMemo(() => {
    return [...rawRecords].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
  }, [rawRecords]);

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

  // Detect pattern
  const absentDays = records
    .filter((r) => r.status === "absent")
    .map((r) => new Date(r.date + "T00:00:00").getDay());

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let pattern: string | null = null;
  if (absentDays.length >= 2) {
    const dayCounts: Record<number, number> = {};
    for (const day of absentDays) {
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }
    const maxDay = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0];
    if (maxDay && Number(maxDay[1]) >= 2) {
      pattern = `Mostly ${dayNames[Number(maxDay[0])]}s`;
    }
  }

  // Unique records (dedupe by date, take first)
  const uniqueByDate = new Map<string, typeof records[0]>();
  for (const r of records) {
    const key = `${r.date}-${r.classId}`;
    if (!uniqueByDate.has(key)) uniqueByDate.set(key, r);
  }
  const displayRecords = Array.from(uniqueByDate.values()).slice(0, 20);

  return (
    <Card title="Attendance Log">
      {/* Summary */}
      <div className="mb-3 flex flex-wrap gap-3 text-sm">
        <span>
          Rate: <span className={`font-bold ${rate >= 90 ? "text-emerald-600" : rate >= 80 ? "text-amber-600" : "text-red-600"}`}>{rate}%</span>
        </span>
        <span>
          Absent: <span className="font-bold text-red-600">{absent}</span> days
        </span>
        <span>
          Late: <span className="font-bold text-amber-600">{late}</span> days
        </span>
        {pattern && (
          <Badge variant="warning">{pattern}</Badge>
        )}
      </div>

      {/* Record list */}
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {displayRecords.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50"
          >
            <span className="text-gray-600">{formatDate(record.date)}</span>
            <Badge variant={statusVariant[record.status]}>
              {getAttendanceLabel(record.status)}
            </Badge>
          </div>
        ))}
      </div>

      {displayRecords.length === 0 && (
        <p className="text-sm text-gray-500">No attendance records yet.</p>
      )}
    </Card>
  );
}
