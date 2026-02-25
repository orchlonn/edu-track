"use client";

import { useReducer, useEffect, useMemo, useState } from "react";
import { useClassContext } from "@/contexts/class-context";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GradeEntryTable } from "@/components/grades/grade-entry-table";
import { GradeSummary } from "@/components/grades/grade-summary";
import { fetchClasses, fetchStudentsByClass, fetchExamsByClass, fetchGradeEntriesForExam } from "@/lib/supabase/queries";
import { saveGrades, publishGrades } from "@/app/actions/grades";
import { type Class, type Student, type Exam } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Save, Send } from "lucide-react";

// ─── Reducer ─────────────────────────────────────────
interface GradeState {
  scores: Record<string, number | null>;
  isDraft: boolean;
  isPublished: boolean;
}

type GradeAction =
  | { type: "SET_SCORE"; studentId: string; score: number | null }
  | { type: "SAVE_DRAFT" }
  | { type: "PUBLISH" }
  | { type: "LOAD"; scores: Record<string, number | null> };

function gradeReducer(state: GradeState, action: GradeAction): GradeState {
  switch (action.type) {
    case "SET_SCORE":
      return {
        ...state,
        scores: { ...state.scores, [action.studentId]: action.score },
        isDraft: true,
        isPublished: false,
      };
    case "SAVE_DRAFT":
      return { ...state, isDraft: true, isPublished: false };
    case "PUBLISH":
      return { ...state, isDraft: false, isPublished: true };
    case "LOAD":
      return { scores: action.scores, isDraft: false, isPublished: false };
    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────
export default function GradesPage() {
  const { selectedClassId, setSelectedClassId } = useClassContext();
  const [classList, setClassList] = useState<Class[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const [state, dispatch] = useReducer(gradeReducer, {
    scores: {},
    isDraft: false,
    isPublished: false,
  });

  // Load classes
  useEffect(() => {
    fetchClasses().then(setClassList);
  }, []);

  // Load students + exams when class changes
  useEffect(() => {
    fetchStudentsByClass(selectedClassId).then(setStudentList);
    fetchExamsByClass(selectedClassId).then((exams) => {
      setExamList(exams);
      if (exams.length > 0) {
        setSelectedExamId(exams[exams.length - 1].id);
      } else {
        setSelectedExamId("");
      }
    });
  }, [selectedClassId]);

  // Load grades when exam changes
  useEffect(() => {
    if (!selectedExamId) return;
    fetchGradeEntriesForExam(selectedExamId).then((entries) => {
      const scores: Record<string, number | null> = {};
      for (const student of studentList) {
        const entry = entries.find((e) => e.studentId === student.id);
        scores[student.id] = entry?.score ?? null;
      }
      dispatch({ type: "LOAD", scores });
    });
  }, [selectedExamId, studentList]);

  const selectedExam = examList.find((e) => e.id === selectedExamId);
  const classOptions = classList.map((c) => ({ value: c.id, label: c.name }));
  const examOptions = examList.map((e) => ({
    value: e.id,
    label: `${e.name} (${formatDate(e.date)})`,
  }));

  const enteredCount = Object.values(state.scores).filter((s) => s !== null).length;

  async function handleSaveDraft() {
    if (!selectedExamId) return;
    const entries = Object.entries(state.scores).map(([studentId, score]) => ({
      studentId,
      score,
    }));
    await saveGrades(selectedExamId, selectedClassId, entries);
    dispatch({ type: "SAVE_DRAFT" });
  }

  async function handlePublish() {
    if (!selectedExamId) return;
    const entries = Object.entries(state.scores).map(([studentId, score]) => ({
      studentId,
      score,
    }));
    await saveGrades(selectedExamId, selectedClassId, entries);
    await publishGrades(selectedExamId);
    dispatch({ type: "PUBLISH" });
    setShowPublishConfirm(false);
  }

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
          <Select
            label="Exam"
            options={examOptions}
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          />
        </div>
      </div>

      {selectedExam && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>Max Score: <span className="font-semibold text-gray-700">{selectedExam.maxScore}</span></span>
          <span className="text-gray-300">|</span>
          <span>Type: <span className="font-semibold text-gray-700 capitalize">{selectedExam.type}</span></span>
          <span className="text-gray-300">|</span>
          <span>
            Status:{" "}
            <span className={`font-semibold ${selectedExam.isPublished ? "text-emerald-600" : "text-amber-600"}`}>
              {selectedExam.isPublished ? "Published" : "Draft"}
            </span>
          </span>
        </div>
      )}

      {selectedExam ? (
        <>
          <GradeEntryTable
            students={studentList}
            scores={state.scores}
            maxScore={selectedExam.maxScore}
            onScoreChange={(studentId, score) =>
              dispatch({ type: "SET_SCORE", studentId, score })
            }
          />

          <GradeSummary
            scores={state.scores}
            maxScore={selectedExam.maxScore}
            totalStudents={studentList.length}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
              {state.isDraft ? "Draft Saved" : "Save as Draft"}
            </Button>
            <Button variant="primary" onClick={() => setShowPublishConfirm(true)}>
              <Send className="h-4 w-4" />
              Publish to Parents
            </Button>
          </div>

          {showPublishConfirm && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                You are about to publish scores for {selectedExam.name}.
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {enteredCount}/{studentList.length} students have scores entered.
                {enteredCount < studentList.length && (
                  <span className="font-medium"> {studentList.length - enteredCount} students have no score.</span>
                )}
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="primary" size="sm" onClick={handlePublish}>
                  Publish All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowPublishConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {state.isPublished && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Scores have been published! Parents can now view them on the portal.
            </div>
          )}
        </>
      ) : (
        <p className="py-8 text-center text-gray-500">
          No exams found for this class. Create a new exam to start entering scores.
        </p>
      )}
    </div>
  );
}
