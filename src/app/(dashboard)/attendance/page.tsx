"use client";

import { useReducer, useEffect, useMemo, useState, useCallback } from "react";
import { useClassContext } from "@/contexts/class-context";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StudentAttendanceRow } from "@/components/attendance/student-attendance-row";
import { AttendanceSummaryBar } from "@/components/attendance/attendance-summary-bar";
import { fetchClasses, fetchStudentsByClass, fetchAttendanceForClassDate } from "@/lib/supabase/queries";
import { saveAttendance } from "@/app/actions/attendance";
import { type AttendanceStatus, type Class, type Student } from "@/lib/types";
import { CheckCheck, Search } from "lucide-react";

// ─── Reducer ─────────────────────────────────────────
interface AttendanceState {
  records: Record<string, AttendanceStatus>;
  previousRecords: Record<string, AttendanceStatus> | null;
  isSaved: boolean;
}

type AttendanceAction =
  | { type: "SET_STATUS"; studentId: string; status: AttendanceStatus }
  | { type: "MARK_ALL_PRESENT"; studentIds: string[] }
  | { type: "SAVE" }
  | { type: "UNDO" }
  | { type: "LOAD"; records: Record<string, AttendanceStatus> };

function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
  switch (action.type) {
    case "SET_STATUS":
      return {
        ...state,
        previousRecords: { ...state.records },
        records: { ...state.records, [action.studentId]: action.status },
        isSaved: false,
      };
    case "MARK_ALL_PRESENT": {
      const newRecords: Record<string, AttendanceStatus> = {};
      for (const id of action.studentIds) {
        newRecords[id] = "present";
      }
      return {
        ...state,
        previousRecords: { ...state.records },
        records: newRecords,
        isSaved: false,
      };
    }
    case "SAVE":
      return { ...state, isSaved: true, previousRecords: null };
    case "UNDO":
      if (!state.previousRecords) return state;
      return {
        ...state,
        records: state.previousRecords,
        previousRecords: null,
        isSaved: false,
      };
    case "LOAD":
      return {
        records: action.records,
        previousRecords: null,
        isSaved: false,
      };
    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────
export default function AttendancePage() {
  const { selectedClassId, setSelectedClassId, selectedDate, setSelectedDate } = useClassContext();
  const [classList, setClassList] = useState<Class[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedDate, setLoadedDate] = useState("");

  const [state, dispatch] = useReducer(attendanceReducer, {
    records: {},
    previousRecords: null,
    isSaved: false,
  });

  // Load classes and auto-select first if none selected
  useEffect(() => {
    fetchClasses().then((classes) => {
      setClassList(classes);
      if (!selectedClassId && classes.length > 0) {
        setSelectedClassId(classes[0].id);
      }
    });
  }, []);

  // Load students when class changes
  useEffect(() => {
    if (!selectedClassId) return;
    fetchStudentsByClass(selectedClassId).then(setStudentList);
  }, [selectedClassId]);

  // Load attendance for the current class and date
  const loadAttendance = useCallback(async (students: Student[] = studentList) => {
    if (!selectedClassId || students.length === 0) return;
    setIsLoading(true);
    try {
      const existing = await fetchAttendanceForClassDate(selectedClassId, selectedDate);
      const records: Record<string, AttendanceStatus> = {};
      for (const student of students) {
        const record = existing.find((r) => r.studentId === student.id);
        records[student.id] = record?.status || "present";
      }
      dispatch({ type: "LOAD", records });
      setLoadedDate(selectedDate);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassId, selectedDate, studentList]);

  // Auto-load when class changes (students list updates)
  useEffect(() => {
    if (studentList.length > 0) {
      loadAttendance(studentList);
    }
  }, [selectedClassId, studentList]);

  const currentClass = classList.find((c) => c.id === selectedClassId);
  const classOptions = classList.map((c) => ({ value: c.id, label: c.name }));

  const handleSave = useCallback(async () => {
    const records = Object.entries(state.records).map(([studentId, status]) => ({
      studentId,
      status,
    }));
    await saveAttendance(selectedClassId, selectedDate, records);
    dispatch({ type: "SAVE" });
  }, [state.records, selectedClassId, selectedDate]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Select
            label="Class"
            options={classOptions}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Button
              size="md"
              onClick={() => loadAttendance()}
              disabled={isLoading || selectedDate === loadedDate}
            >
              <Search className="h-4 w-4" />
              {isLoading ? "Loading..." : "Load"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="success"
          size="md"
          onClick={() => dispatch({ type: "MARK_ALL_PRESENT", studentIds: studentList.map((s) => s.id) })}
        >
          <CheckCheck className="h-4 w-4" />
          Mark All Present
        </Button>
        <span className="text-sm text-gray-500">
          {studentList.length} students {currentClass && `in ${currentClass.name}`}
        </span>
      </div>

      <div className="space-y-1.5">
        {studentList.map((student, i) => (
          <StudentAttendanceRow
            key={student.id}
            student={student}
            status={state.records[student.id] || "present"}
            onChange={(studentId, status) =>
              dispatch({ type: "SET_STATUS", studentId, status })
            }
            index={i}
          />
        ))}
      </div>

      {studentList.length === 0 && (
        <p className="py-8 text-center text-gray-500">No students in this class.</p>
      )}

      {studentList.length > 0 && (
        <AttendanceSummaryBar
          records={state.records}
          onSave={handleSave}
          onUndo={() => dispatch({ type: "UNDO" })}
          canUndo={state.previousRecords !== null}
          isSaved={state.isSaved}
        />
      )}
    </div>
  );
}
