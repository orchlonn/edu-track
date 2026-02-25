"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type TeacherNote } from "@/lib/types";
import { addNote } from "@/app/actions/notes";
import { Plus } from "lucide-react";

interface TeacherNotesProps {
  studentId: string;
  initialNotes: TeacherNote[];
}

export function TeacherNotes({ studentId, initialNotes }: TeacherNotesProps) {
  const [notes, setNotes] = useState<TeacherNote[]>(initialNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState("");

  async function handleAdd() {
    if (!newNote.trim()) return;
    const note: TeacherNote = {
      id: `n-${Date.now()}`,
      studentId,
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
    setNewNote("");
    setIsAdding(false);

    await addNote(studentId, note.content);
  }

  const formatNoteDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      title="Teacher Notes"
      action={
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      }
    >
      {isAdding && (
        <div className="mb-3 space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note about this student..."
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newNote.trim()}>
              Save Note
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setNewNote(""); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">{formatNoteDate(note.createdAt)}</p>
            <p className="mt-1 text-sm text-gray-700">{note.content}</p>
          </div>
        ))}
      </div>

      {notes.length === 0 && !isAdding && (
        <p className="text-sm text-gray-500">No notes yet. Click &ldquo;Add&rdquo; to create one.</p>
      )}
    </Card>
  );
}
