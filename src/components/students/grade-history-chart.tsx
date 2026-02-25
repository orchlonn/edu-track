"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { type GradeEntry, type Exam, type Class } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

interface GradeHistoryChartProps {
  gradeEntries: GradeEntry[];
  exams: Exam[];
  classes: Class[];
}

export function GradeHistoryChart({ gradeEntries, exams, classes }: GradeHistoryChartProps) {
  const chartData = useMemo(() => {
    const entries = gradeEntries.filter(
      (e) => e.isPublished && e.score !== null
    );

    const dataMap = new Map<string, Record<string, number | string>>();

    for (const entry of entries) {
      const exam = exams.find((e) => e.id === entry.examId);
      if (!exam) continue;
      const cls = classes.find((c) => c.id === entry.classId);
      if (!cls) continue;

      const key = exam.date;
      if (!dataMap.has(key)) {
        dataMap.set(key, { date: formatDateShort(exam.date), sortKey: exam.date });
      }
      const row = dataMap.get(key)!;
      row[cls.subject] = Math.round((entry.score! / exam.maxScore) * 100);
    }

    return Array.from(dataMap.values()).sort((a, b) =>
      (a.sortKey as string).localeCompare(b.sortKey as string)
    );
  }, [gradeEntries, exams, classes]);

  const subjects = useMemo(() => {
    const subjectSet = new Set<string>();
    for (const entry of gradeEntries) {
      const cls = classes.find((c) => c.id === entry.classId);
      if (cls) subjectSet.add(cls.subject);
    }
    return Array.from(subjectSet);
  }, [gradeEntries, classes]);

  const colors = ["#2563eb", "#16a34a", "#d97706", "#dc2626"];

  if (chartData.length === 0) {
    return (
      <Card title="Grade History">
        <p className="text-sm text-gray-500">No published grades yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Grade History">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              formatter={(value) => [`${value}%`]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {subjects.map((subject, i) => (
              <Line
                key={subject}
                type="monotone"
                dataKey={subject}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
