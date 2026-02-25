"use client";

import { useState, useMemo } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { StudentCard } from "./student-card";
import { type Student, type Class } from "@/lib/types";

interface StudentListProps {
  students: Student[];
  classes: Class[];
  statsMap: Record<string, { avg: number | null; attendance: number }>;
}

export function StudentList({ students, classes, statsMap }: StudentListProps) {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const classOptions = [
    { value: "all", label: "All Classes" },
    ...classes.map((c) => ({ value: c.id, label: c.name })),
  ];

  const filteredStudents = useMemo(() => {
    let list = students;

    if (classFilter !== "all") {
      const cls = classes.find((c) => c.id === classFilter);
      if (cls) {
        list = list.filter((s) => cls.studentIds.includes(s.id));
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          `${s.lastName}, ${s.firstName}`.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [search, classFilter, students, classes]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search students..."
          className="flex-1"
        />
        <div className="w-full sm:w-48">
          <Select
            options={classOptions}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            avg={statsMap[student.id]?.avg ?? null}
            attendance={statsMap[student.id]?.attendance ?? 100}
          />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <p className="py-8 text-center text-gray-500">
          No students found{search ? ` matching "${search}"` : ""}.
        </p>
      )}

      <p className="text-xs text-gray-400">
        Showing {filteredStudents.length} of {students.length} students
      </p>
    </div>
  );
}
