"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useClassContext } from "@/contexts/class-context";
import {
  fetchClasses,
  fetchAllAttendanceRecords,
  fetchAttendanceDailyBreakdown,
} from "@/lib/supabase/queries";
import { formatDateShort } from "@/lib/utils";
import type { Class, AttendanceRecord } from "@/lib/types";

export function AttendanceTrends() {
  const { selectedClassId, setSelectedClassId } = useClassContext();
  const [classList, setClassList] = useState<Class[]>([]);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [chartData, setChartData] = useState<{ date: string; Present: number; Absent: number; Late: number; Excused: number }[]>([]);

  useEffect(() => {
    fetchClasses().then(setClassList);
    fetchAllAttendanceRecords().then(setAllRecords);
  }, []);

  useEffect(() => {
    async function loadChart() {
      if (selectedClassId === "all" || !classList.find((c) => c.id === selectedClassId)) {
        const dates = [...new Set(allRecords.map((r) => r.date))].sort();
        setChartData(dates.map((date) => {
          const records = allRecords.filter((r) => r.date === date);
          return {
            date: formatDateShort(date),
            Present: records.filter((r) => r.status === "present").length,
            Absent: records.filter((r) => r.status === "absent").length,
            Late: records.filter((r) => r.status === "late").length,
            Excused: records.filter((r) => r.status === "excused").length,
          };
        }));
      } else {
        const breakdown = await fetchAttendanceDailyBreakdown(selectedClassId);
        setChartData(breakdown.map((d) => ({
          date: formatDateShort(d.date),
          Present: d.present,
          Absent: d.absent,
          Late: d.late,
          Excused: d.excused,
        })));
      }
    }
    loadChart();
  }, [selectedClassId, classList, allRecords]);

  const classOptions = [
    { value: "all", label: "All Classes" },
    ...classList.map((c) => ({ value: c.id, label: c.name })),
  ];

  const summary = useMemo(() => {
    const records =
      selectedClassId === "all" || !classList.find((c) => c.id === selectedClassId)
        ? allRecords
        : allRecords.filter((r) => r.classId === selectedClassId);

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    const absentDays = records
      .filter((r) => r.status === "absent")
      .map((r) => new Date(r.date + "T00:00:00").getDay());
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayCounts: Record<number, number> = {};
    for (const day of absentDays) {
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }
    const worstDay = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0];
    const worstDayName = worstDay ? dayNames[Number(worstDay[0])] : "N/A";

    return { total, present, absent, late, rate, worstDayName };
  }, [selectedClassId, classList, allRecords]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-56">
          <Select
            label="Class"
            options={classOptions}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span>
            Overall Rate:{" "}
            <span className={`font-bold ${summary.rate >= 90 ? "text-emerald-600" : summary.rate >= 80 ? "text-amber-600" : "text-red-600"}`}>
              {summary.rate}%
            </span>
          </span>
          <span>
            Total Absent: <span className="font-bold text-red-600">{summary.absent}</span>
          </span>
          <span>
            Most Absent Day: <Badge variant="warning">{summary.worstDayName}</Badge>
          </span>
        </div>
      </div>

      <Card title="Attendance by Date">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Present" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Late" stackId="a" fill="#d97706" />
              <Bar dataKey="Excused" stackId="a" fill="#2563eb" />
              <Bar dataKey="Absent" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
