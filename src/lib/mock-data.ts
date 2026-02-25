import {
  type Teacher,
  type Class,
  type Student,
  type ScheduleItem,
  type AttendanceRecord,
  type Exam,
  type GradeEntry,
  type ActionItem,
  type Activity,
  type Message,
  type TeacherNote,
} from "./types";
import { calculateLetterGrade } from "./utils";

// ─── Teacher ─────────────────────────────────────────
export const teacher: Teacher = {
  id: "t1",
  name: "Ms. Johnson",
  email: "johnson@school.edu",
  subject: "Math & Science",
};

// ─── Classes ─────────────────────────────────────────
export const classes: Class[] = [
  {
    id: "c1",
    name: "7A - Math",
    subject: "Mathematics",
    grade: "7th Grade",
    room: "Room 204",
    studentIds: ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12"],
  },
  {
    id: "c2",
    name: "7B - Math",
    subject: "Mathematics",
    grade: "7th Grade",
    room: "Room 204",
    studentIds: ["s5","s6","s13","s14","s15","s16","s17","s18","s19","s20"],
  },
  {
    id: "c3",
    name: "7A - Science",
    subject: "Science",
    grade: "7th Grade",
    room: "Room 112",
    studentIds: ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12"],
  },
  {
    id: "c4",
    name: "7B - Science",
    subject: "Science",
    grade: "7th Grade",
    room: "Room 112",
    studentIds: ["s5","s6","s13","s14","s15","s16","s17","s18","s19","s20"],
  },
];

// ─── Students ────────────────────────────────────────
export const students: Student[] = [
  { id: "s1", firstName: "Anand", lastName: "Batbold", email: "anand.b@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "B. Batbold", parentPhone: "+976 9911-1001", parentEmail: "batbold@email.com", enrollmentDate: "2025-09-01" },
  { id: "s2", firstName: "Bat-Erdene", lastName: "Sukhbaatar", email: "baterdene.s@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "S. Sukhbaatar", parentPhone: "+976 9911-1002", parentEmail: "sukhbaatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s3", firstName: "Bolormaa", lastName: "Tseren", email: "bolormaa.t@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "Ts. Tseren", parentPhone: "+976 9911-1003", parentEmail: "tseren@email.com", enrollmentDate: "2025-09-01" },
  { id: "s4", firstName: "Dalai", lastName: "Munkhbat", email: "dalai.m@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "M. Munkhbat", parentPhone: "+976 9911-1004", parentEmail: "munkhbat@email.com", enrollmentDate: "2025-09-01" },
  { id: "s5", firstName: "Enkhjin", lastName: "Oyuntsetseg", email: "enkhjin.o@school.edu", grade: "7th", classIds: ["c1","c2","c3","c4"], parentName: "O. Oyuntsetseg", parentPhone: "+976 9911-1005", parentEmail: "oyuntsetseg@email.com", enrollmentDate: "2025-09-01" },
  { id: "s6", firstName: "Ganzorig", lastName: "Erdene", email: "ganzorig.e@school.edu", grade: "7th", classIds: ["c1","c2","c3","c4"], parentName: "E. Erdene", parentPhone: "+976 9911-1006", parentEmail: "erdene@email.com", enrollmentDate: "2025-09-01" },
  { id: "s7", firstName: "Khaliun", lastName: "Dorj", email: "khaliun.d@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "D. Dorj", parentPhone: "+976 9911-1007", parentEmail: "dorj@email.com", enrollmentDate: "2025-09-01" },
  { id: "s8", firstName: "Munkhtsetseg", lastName: "Baatar", email: "munkhtsetseg.b@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "B. Baatar", parentPhone: "+976 9911-1008", parentEmail: "baatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s9", firstName: "Nomin", lastName: "Altantsetseg", email: "nomin.a@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "A. Altantsetseg", parentPhone: "+976 9911-1009", parentEmail: "altantsetseg@email.com", enrollmentDate: "2025-09-01" },
  { id: "s10", firstName: "Oyuunbileg", lastName: "Ganbold", email: "oyuunbileg.g@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "G. Ganbold", parentPhone: "+976 9911-1010", parentEmail: "ganbold@email.com", enrollmentDate: "2025-09-01" },
  { id: "s11", firstName: "Purevdorj", lastName: "Naran", email: "purevdorj.n@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "N. Naran", parentPhone: "+976 9911-1011", parentEmail: "naran@email.com", enrollmentDate: "2025-09-01" },
  { id: "s12", firstName: "Sarangerel", lastName: "Bat-Ochir", email: "sarangerel.b@school.edu", grade: "7th", classIds: ["c1","c3"], parentName: "B. Bat-Ochir", parentPhone: "+976 9911-1012", parentEmail: "batochir@email.com", enrollmentDate: "2025-09-01" },
  { id: "s13", firstName: "Temuulen", lastName: "Chinbat", email: "temuulen.c@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "Ch. Chinbat", parentPhone: "+976 9911-1013", parentEmail: "chinbat@email.com", enrollmentDate: "2025-09-01" },
  { id: "s14", firstName: "Uuriintuya", lastName: "Boldbaatar", email: "uuriintuya.b@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "B. Boldbaatar", parentPhone: "+976 9911-1014", parentEmail: "boldbaatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s15", firstName: "Zaya", lastName: "Byambadorj", email: "zaya.b@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "B. Byambadorj", parentPhone: "+976 9911-1015", parentEmail: "byambadorj@email.com", enrollmentDate: "2025-09-01" },
  { id: "s16", firstName: "Amartuvshin", lastName: "Tserendorj", email: "amartuvshin.t@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "Ts. Tserendorj", parentPhone: "+976 9911-1016", parentEmail: "tserendorj@email.com", enrollmentDate: "2025-09-01" },
  { id: "s17", firstName: "Battsengel", lastName: "Enkhbold", email: "battsengel.e@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "E. Enkhbold", parentPhone: "+976 9911-1017", parentEmail: "enkhbold@email.com", enrollmentDate: "2025-09-01" },
  { id: "s18", firstName: "Chimeg", lastName: "Ganbaatar", email: "chimeg.g@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "G. Ganbaatar", parentPhone: "+976 9911-1018", parentEmail: "ganbaatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s19", firstName: "Dulguun", lastName: "Purevjav", email: "dulguun.p@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "P. Purevjav", parentPhone: "+976 9911-1019", parentEmail: "purevjav@email.com", enrollmentDate: "2025-09-01" },
  { id: "s20", firstName: "Erdenechimeg", lastName: "Sukhee", email: "erdenechimeg.s@school.edu", grade: "7th", classIds: ["c2","c4"], parentName: "S. Sukhee", parentPhone: "+976 9911-1020", parentEmail: "sukhee@email.com", enrollmentDate: "2025-09-01" },
];

// ─── Schedule ────────────────────────────────────────
// Mon-Fri schedule
export const schedule: ScheduleItem[] = [
  { id: "sch1", classId: "c1", period: 1, startTime: "08:00", endTime: "08:50", dayOfWeek: 1 },
  { id: "sch2", classId: "c2", period: 2, startTime: "09:00", endTime: "09:50", dayOfWeek: 1 },
  { id: "sch3", classId: "c3", period: 4, startTime: "11:00", endTime: "11:50", dayOfWeek: 1 },
  { id: "sch4", classId: "c4", period: 6, startTime: "13:00", endTime: "13:50", dayOfWeek: 1 },
  // Same schedule Tue-Fri for simplicity
  { id: "sch5", classId: "c1", period: 1, startTime: "08:00", endTime: "08:50", dayOfWeek: 2 },
  { id: "sch6", classId: "c2", period: 2, startTime: "09:00", endTime: "09:50", dayOfWeek: 2 },
  { id: "sch7", classId: "c3", period: 4, startTime: "11:00", endTime: "11:50", dayOfWeek: 2 },
  { id: "sch8", classId: "c4", period: 6, startTime: "13:00", endTime: "13:50", dayOfWeek: 2 },
  { id: "sch9", classId: "c1", period: 1, startTime: "08:00", endTime: "08:50", dayOfWeek: 3 },
  { id: "sch10", classId: "c2", period: 2, startTime: "09:00", endTime: "09:50", dayOfWeek: 3 },
  { id: "sch11", classId: "c3", period: 4, startTime: "11:00", endTime: "11:50", dayOfWeek: 3 },
  { id: "sch12", classId: "c4", period: 6, startTime: "13:00", endTime: "13:50", dayOfWeek: 3 },
  { id: "sch13", classId: "c1", period: 1, startTime: "08:00", endTime: "08:50", dayOfWeek: 4 },
  { id: "sch14", classId: "c2", period: 2, startTime: "09:00", endTime: "09:50", dayOfWeek: 4 },
  { id: "sch15", classId: "c3", period: 4, startTime: "11:00", endTime: "11:50", dayOfWeek: 4 },
  { id: "sch16", classId: "c4", period: 6, startTime: "13:00", endTime: "13:50", dayOfWeek: 4 },
  { id: "sch17", classId: "c1", period: 1, startTime: "08:00", endTime: "08:50", dayOfWeek: 5 },
  { id: "sch18", classId: "c2", period: 2, startTime: "09:00", endTime: "09:50", dayOfWeek: 5 },
  { id: "sch19", classId: "c3", period: 4, startTime: "11:00", endTime: "11:50", dayOfWeek: 5 },
  { id: "sch20", classId: "c4", period: 6, startTime: "13:00", endTime: "13:50", dayOfWeek: 5 },
];

// ─── Attendance Records (last 2 weeks) ──────────────
function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const dates = [
    "2026-02-09","2026-02-10","2026-02-11","2026-02-12","2026-02-13",
    "2026-02-16","2026-02-17","2026-02-18","2026-02-19","2026-02-20",
  ];
  let id = 1;

  // Students who are sometimes absent
  const absentProne: Record<string, string[]> = {
    s3: ["2026-02-09", "2026-02-16"],  // Bold - absent on Mondays
    s5: ["2026-02-11"],
    s14: ["2026-02-10", "2026-02-17", "2026-02-19"],
    s18: ["2026-02-13"],
  };
  const lateProne: Record<string, string[]> = {
    s7: ["2026-02-10", "2026-02-17"],
    s16: ["2026-02-12"],
  };

  for (const cls of classes) {
    for (const date of dates) {
      for (const studentId of cls.studentIds) {
        let status: AttendanceRecord["status"] = "present";
        if (absentProne[studentId]?.includes(date)) {
          status = "absent";
        } else if (lateProne[studentId]?.includes(date)) {
          status = "late";
        }
        records.push({
          id: `att${id++}`,
          studentId,
          classId: cls.id,
          date,
          status,
        });
      }
    }
  }
  return records;
}

export const attendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

// ─── Exams ───────────────────────────────────────────
export const exams: Exam[] = [
  { id: "e1", classId: "c1", name: "Quiz 1 - Integers", date: "2026-02-05", maxScore: 100, type: "quiz", isPublished: true },
  { id: "e2", classId: "c1", name: "Quiz 2 - Fractions", date: "2026-02-12", maxScore: 100, type: "quiz", isPublished: true },
  { id: "e3", classId: "c1", name: "Quiz 3 - Decimals", date: "2026-02-19", maxScore: 100, type: "quiz", isPublished: false },
  { id: "e4", classId: "c2", name: "Quiz 1 - Integers", date: "2026-02-05", maxScore: 100, type: "quiz", isPublished: true },
  { id: "e5", classId: "c2", name: "Quiz 2 - Fractions", date: "2026-02-12", maxScore: 100, type: "quiz", isPublished: true },
  { id: "e6", classId: "c3", name: "Lab 1 - Cells", date: "2026-02-07", maxScore: 50, type: "project", isPublished: true },
  { id: "e7", classId: "c3", name: "Test 1 - Biology Basics", date: "2026-02-14", maxScore: 100, type: "test", isPublished: true },
  { id: "e8", classId: "c3", name: "Lab 2 - Microscope", date: "2026-02-21", maxScore: 50, type: "project", isPublished: false },
  { id: "e9", classId: "c4", name: "Lab 1 - Cells", date: "2026-02-07", maxScore: 50, type: "project", isPublished: true },
  { id: "e10", classId: "c4", name: "Test 1 - Biology Basics", date: "2026-02-14", maxScore: 100, type: "test", isPublished: true },
];

// ─── Seeded RNG (deterministic across server/client) ─
function createSeededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

// ─── Grade Entries ───────────────────────────────────
function generateGradeEntries(): GradeEntry[] {
  const rng = createSeededRng(42);
  const entries: GradeEntry[] = [];
  let id = 1;

  // Score ranges per student (to create realistic patterns)
  const studentScoreRange: Record<string, [number, number]> = {
    s1: [80, 95], s2: [85, 98], s3: [55, 70], s4: [65, 80],
    s5: [70, 85], s6: [60, 75], s7: [75, 90], s8: [82, 95],
    s9: [88, 100], s10: [72, 85], s11: [68, 82], s12: [90, 100],
    s13: [65, 78], s14: [50, 65], s15: [78, 92], s16: [60, 75],
    s17: [85, 97], s18: [70, 82], s19: [55, 70], s20: [75, 88],
  };

  for (const exam of exams) {
    const cls = classes.find(c => c.id === exam.classId)!;
    for (const studentId of cls.studentIds) {
      const [min, max] = studentScoreRange[studentId] || [60, 80];
      const rawScore = Math.floor(rng() * (max - min + 1)) + min;
      const score = Math.min(rawScore, exam.maxScore);
      const letterGrade = calculateLetterGrade(score, exam.maxScore);
      entries.push({
        id: `g${id++}`,
        studentId,
        examId: exam.id,
        classId: exam.classId,
        score: exam.isPublished ? score : (rng() > 0.3 ? score : null),
        letterGrade: exam.isPublished ? letterGrade : null,
        isPublished: exam.isPublished,
      });
    }
  }
  return entries;
}

export const gradeEntries: GradeEntry[] = generateGradeEntries();

// ─── Action Items ────────────────────────────────────
export const actionItems: ActionItem[] = [
  { id: "a1", title: "Mark attendance for P1 - 7A Math", type: "attendance", priority: "high", link: "/attendance", isCompleted: false },
  { id: "a2", title: "2 parent messages awaiting reply", type: "message", priority: "high", link: "/messages", isCompleted: false },
  { id: "a3", title: "Publish Science Lab 2 scores (due today)", type: "grades", priority: "high", link: "/grades", isCompleted: false },
  { id: "a4", title: "Review Bold T. attendance pattern", type: "alert", priority: "medium", link: "/students/s3", isCompleted: false },
  { id: "a5", title: "Enter Quiz 3 - Decimals scores", type: "grades", priority: "medium", link: "/grades", isCompleted: false },
];

// ─── Activities ──────────────────────────────────────
export const activities: Activity[] = [
  { id: "act1", description: "Published 7A Math Quiz 2 scores", timestamp: "2026-02-23T06:30:00", type: "grade" },
  { id: "act2", description: "Parent of Uuriintuya replied to your message", timestamp: "2026-02-22T14:20:00", type: "message" },
  { id: "act3", description: "Marked attendance for all classes", timestamp: "2026-02-22T08:15:00", type: "attendance" },
  { id: "act4", description: "Published 7B Math Quiz 2 scores", timestamp: "2026-02-21T15:00:00", type: "grade" },
  { id: "act5", description: "Sent progress report to Boldbaatar (Uuriintuya's parent)", timestamp: "2026-02-21T12:00:00", type: "message" },
  { id: "act6", description: "Added note for Bold T. regarding Monday absences", timestamp: "2026-02-20T16:30:00", type: "system" },
  { id: "act7", description: "Marked attendance for all classes", timestamp: "2026-02-20T08:10:00", type: "attendance" },
];

// ─── Messages ────────────────────────────────────────
export const messages: Message[] = [
  {
    id: "m1",
    parentName: "B. Boldbaatar",
    studentId: "s14",
    studentName: "Uuriintuya Boldbaatar",
    subject: "Regarding recent absences",
    preview: "Thank you for letting me know. I will make sure...",
    lastMessageAt: "2026-02-22T14:20:00",
    isRead: false,
    thread: [
      { id: "mt1", senderName: "Ms. Johnson", content: "Dear Mr. Boldbaatar, I wanted to reach out regarding Uuriintuya's recent absences. She has missed 3 days this month which is affecting her class participation. Could we discuss this?", sentAt: "2026-02-21T10:00:00", isFromTeacher: true },
      { id: "mt2", senderName: "B. Boldbaatar", content: "Thank you for letting me know. I will make sure she attends regularly. She had some health issues but is better now.", sentAt: "2026-02-22T14:20:00", isFromTeacher: false },
    ],
  },
  {
    id: "m2",
    parentName: "Ts. Tseren",
    studentId: "s3",
    studentName: "Bolormaa Tseren",
    subject: "Math tutoring question",
    preview: "Is there any extra help available for...",
    lastMessageAt: "2026-02-20T09:30:00",
    isRead: false,
    thread: [
      { id: "mt3", senderName: "Ts. Tseren", content: "Dear Ms. Johnson, Bolormaa is struggling with fractions at home. Is there any extra help available for her after school?", sentAt: "2026-02-20T09:30:00", isFromTeacher: false },
    ],
  },
  {
    id: "m3",
    parentName: "A. Altantsetseg",
    studentId: "s9",
    studentName: "Nomin Altantsetseg",
    subject: "Science fair project",
    preview: "Nomin is very excited about the science fair...",
    lastMessageAt: "2026-02-19T11:00:00",
    isRead: true,
    thread: [
      { id: "mt4", senderName: "Ms. Johnson", content: "I wanted to let you know that Nomin's science project proposal on plant growth was excellent. She should start working on the experiment soon.", sentAt: "2026-02-18T14:00:00", isFromTeacher: true },
      { id: "mt5", senderName: "A. Altantsetseg", content: "Nomin is very excited about the science fair! We already bought the supplies. Thank you for encouraging her.", sentAt: "2026-02-19T11:00:00", isFromTeacher: false },
    ],
  },
  {
    id: "m4",
    parentName: "M. Munkhbat",
    studentId: "s4",
    studentName: "Dalai Munkhbat",
    subject: "Field trip permission",
    preview: "Yes, Dalai has our permission to attend...",
    lastMessageAt: "2026-02-17T16:45:00",
    isRead: true,
    thread: [
      { id: "mt6", senderName: "Ms. Johnson", content: "Dear Mr. Munkhbat, we're organizing a field trip to the Science Museum on March 5th. Please confirm if Dalai has permission to attend.", sentAt: "2026-02-17T10:00:00", isFromTeacher: true },
      { id: "mt7", senderName: "M. Munkhbat", content: "Yes, Dalai has our permission to attend the field trip. Thank you!", sentAt: "2026-02-17T16:45:00", isFromTeacher: false },
    ],
  },
  {
    id: "m5",
    parentName: "D. Dorj",
    studentId: "s7",
    studentName: "Khaliun Dorj",
    subject: "Late arrivals",
    preview: "We are working on getting her to school on time...",
    lastMessageAt: "2026-02-18T08:30:00",
    isRead: true,
    thread: [
      { id: "mt8", senderName: "Ms. Johnson", content: "I've noticed Khaliun has been arriving late to first period a few times recently. Is everything okay?", sentAt: "2026-02-17T15:00:00", isFromTeacher: true },
      { id: "mt9", senderName: "D. Dorj", content: "We are working on getting her to school on time. The bus schedule changed recently and we're adjusting. Thank you for your patience.", sentAt: "2026-02-18T08:30:00", isFromTeacher: false },
    ],
  },
];

// ─── Teacher Notes ───────────────────────────────────
export const teacherNotes: TeacherNote[] = [
  { id: "n1", studentId: "s3", content: "Spoke with parent about Monday absences. Parent will ensure attendance.", createdAt: "2026-02-18T15:00:00" },
  { id: "n2", studentId: "s3", content: "Student struggling with fractions. Moved to front row. Extra worksheets assigned.", createdAt: "2026-02-10T14:30:00" },
  { id: "n3", studentId: "s14", content: "Three absences this month. Sent message to parent.", createdAt: "2026-02-21T10:15:00" },
  { id: "n4", studentId: "s9", content: "Excellent science fair proposal. Very engaged in class.", createdAt: "2026-02-18T14:15:00" },
  { id: "n5", studentId: "s7", content: "Late arrivals - bus schedule issue. Parent is addressing.", createdAt: "2026-02-18T08:45:00" },
  { id: "n6", studentId: "s12", content: "Consistently top performer. Consider recommending for advanced math.", createdAt: "2026-02-15T13:00:00" },
];

// ─── Helper Functions ────────────────────────────────
export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getClassById(id: string): Class | undefined {
  return classes.find(c => c.id === id);
}

export function getStudentsByClass(classId: string): Student[] {
  const cls = classes.find(c => c.id === classId);
  if (!cls) return [];
  return cls.studentIds.map(id => students.find(s => s.id === id)!).filter(Boolean);
}

export function getScheduleForDay(dayOfWeek: number): ScheduleItem[] {
  return schedule
    .filter(s => s.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.period - b.period);
}

export function getTodaySchedule(): ScheduleItem[] {
  const today = new Date().getDay();
  return getScheduleForDay(today);
}

export function getAttendanceForClassDate(classId: string, date: string): AttendanceRecord[] {
  return attendanceRecords.filter(r => r.classId === classId && r.date === date);
}

export function getExamsByClass(classId: string): Exam[] {
  return exams.filter(e => e.classId === classId);
}

export function getGradeEntriesForExam(examId: string): GradeEntry[] {
  return gradeEntries.filter(g => g.examId === examId);
}

export function getGradeEntriesForStudent(studentId: string): GradeEntry[] {
  return gradeEntries.filter(g => g.studentId === studentId);
}

export function getAttendanceForStudent(studentId: string): AttendanceRecord[] {
  return attendanceRecords.filter(r => r.studentId === studentId);
}

export function getNotesForStudent(studentId: string): TeacherNote[] {
  return teacherNotes.filter(n => n.studentId === studentId);
}

export function getMessagesForStudent(studentId: string): Message[] {
  return messages.filter(m => m.studentId === studentId);
}

export function getStudentAverageGrade(studentId: string, classId?: string): number | null {
  let entries = gradeEntries.filter(g => g.studentId === studentId && g.isPublished && g.score !== null);
  if (classId) entries = entries.filter(g => g.classId === classId);
  if (entries.length === 0) return null;

  let totalPct = 0;
  for (const entry of entries) {
    const exam = exams.find(e => e.id === entry.examId)!;
    totalPct += (entry.score! / exam.maxScore) * 100;
  }
  return Math.round(totalPct / entries.length);
}

export function getStudentAttendanceRate(studentId: string): number {
  const records = attendanceRecords.filter(r => r.studentId === studentId);
  if (records.length === 0) return 100;
  const present = records.filter(r => r.status === "present" || r.status === "late").length;
  return Math.round((present / records.length) * 100);
}

export function getUnreadMessageCount(): number {
  return messages.filter(m => !m.isRead).length;
}

export function getAttendanceDailyBreakdown(classId: string): { date: string; present: number; absent: number; late: number; excused: number }[] {
  const dates = [...new Set(attendanceRecords.filter(r => r.classId === classId).map(r => r.date))].sort();
  return dates.map(date => {
    const records = attendanceRecords.filter(r => r.classId === classId && r.date === date);
    return {
      date,
      present: records.filter(r => r.status === "present").length,
      absent: records.filter(r => r.status === "absent").length,
      late: records.filter(r => r.status === "late").length,
      excused: records.filter(r => r.status === "excused").length,
    };
  });
}

export function getGradeDistributionByClass(classId: string): { A: number; B: number; C: number; D: number; F: number } {
  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  const cls = classes.find(c => c.id === classId);
  if (!cls) return dist;

  for (const studentId of cls.studentIds) {
    const avg = getStudentAverageGrade(studentId, classId);
    if (avg === null) continue;
    if (avg >= 90) dist.A++;
    else if (avg >= 80) dist.B++;
    else if (avg >= 70) dist.C++;
    else if (avg >= 60) dist.D++;
    else dist.F++;
  }
  return dist;
}
