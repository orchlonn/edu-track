import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

// ─── Config ──────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Run: source .env.local && npx tsx scripts/seed.ts");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Deterministic UUID from short ID ────────────────
function toUuid(shortId: string): string {
  const hash = createHash("sha256").update(shortId).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

// ─── Seeded RNG (matches mock-data.ts) ───────────────
function createSeededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

// ─── Letter grade calculation (matches utils.ts) ─────
function calculateLetterGrade(score: number, maxScore: number): string {
  const pct = (score / maxScore) * 100;
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 60) return "D";
  return "F";
}

// ─── Dev credentials ─────────────────────────────────
const DEV_EMAIL = "johnson@school.edu";
const DEV_PASSWORD = "password123";

// ─── Data ────────────────────────────────────────────
const teacherData = {
  id: "t1",
  name: "Ms. Johnson",
  email: "johnson@school.edu",
  subject: "Math & Science",
};

const classesData = [
  { id: "c1", name: "7A - Math", subject: "Mathematics", grade: "7th Grade", room: "Room 204" },
  { id: "c2", name: "7B - Math", subject: "Mathematics", grade: "7th Grade", room: "Room 204" },
  { id: "c3", name: "7A - Science", subject: "Science", grade: "7th Grade", room: "Room 112" },
  { id: "c4", name: "7B - Science", subject: "Science", grade: "7th Grade", room: "Room 112" },
];

const classStudentMap: Record<string, string[]> = {
  c1: ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12"],
  c2: ["s5","s6","s13","s14","s15","s16","s17","s18","s19","s20"],
  c3: ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12"],
  c4: ["s5","s6","s13","s14","s15","s16","s17","s18","s19","s20"],
};

const studentsData = [
  { id: "s1", firstName: "Anand", lastName: "Batbold", email: "anand.b@school.edu", grade: "7th", parentName: "B. Batbold", parentPhone: "+976 9911-1001", parentEmail: "batbold@email.com", enrollmentDate: "2025-09-01" },
  { id: "s2", firstName: "Bat-Erdene", lastName: "Sukhbaatar", email: "baterdene.s@school.edu", grade: "7th", parentName: "S. Sukhbaatar", parentPhone: "+976 9911-1002", parentEmail: "sukhbaatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s3", firstName: "Bolormaa", lastName: "Tseren", email: "bolormaa.t@school.edu", grade: "7th", parentName: "Ts. Tseren", parentPhone: "+976 9911-1003", parentEmail: "tseren@email.com", enrollmentDate: "2025-09-01" },
  { id: "s4", firstName: "Dalai", lastName: "Munkhbat", email: "dalai.m@school.edu", grade: "7th", parentName: "M. Munkhbat", parentPhone: "+976 9911-1004", parentEmail: "munkhbat@email.com", enrollmentDate: "2025-09-01" },
  { id: "s5", firstName: "Enkhjin", lastName: "Oyuntsetseg", email: "enkhjin.o@school.edu", grade: "7th", parentName: "O. Oyuntsetseg", parentPhone: "+976 9911-1005", parentEmail: "oyuntsetseg@email.com", enrollmentDate: "2025-09-01" },
  { id: "s6", firstName: "Ganzorig", lastName: "Erdene", email: "ganzorig.e@school.edu", grade: "7th", parentName: "E. Erdene", parentPhone: "+976 9911-1006", parentEmail: "erdene@email.com", enrollmentDate: "2025-09-01" },
  { id: "s7", firstName: "Khaliun", lastName: "Dorj", email: "khaliun.d@school.edu", grade: "7th", parentName: "D. Dorj", parentPhone: "+976 9911-1007", parentEmail: "dorj@email.com", enrollmentDate: "2025-09-01" },
  { id: "s8", firstName: "Munkhtsetseg", lastName: "Baatar", email: "munkhtsetseg.b@school.edu", grade: "7th", parentName: "B. Baatar", parentPhone: "+976 9911-1008", parentEmail: "baatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s9", firstName: "Nomin", lastName: "Altantsetseg", email: "nomin.a@school.edu", grade: "7th", parentName: "A. Altantsetseg", parentPhone: "+976 9911-1009", parentEmail: "altantsetseg@email.com", enrollmentDate: "2025-09-01" },
  { id: "s10", firstName: "Oyuunbileg", lastName: "Ganbold", email: "oyuunbileg.g@school.edu", grade: "7th", parentName: "G. Ganbold", parentPhone: "+976 9911-1010", parentEmail: "ganbold@email.com", enrollmentDate: "2025-09-01" },
  { id: "s11", firstName: "Purevdorj", lastName: "Naran", email: "purevdorj.n@school.edu", grade: "7th", parentName: "N. Naran", parentPhone: "+976 9911-1011", parentEmail: "naran@email.com", enrollmentDate: "2025-09-01" },
  { id: "s12", firstName: "Sarangerel", lastName: "Bat-Ochir", email: "sarangerel.b@school.edu", grade: "7th", parentName: "B. Bat-Ochir", parentPhone: "+976 9911-1012", parentEmail: "batochir@email.com", enrollmentDate: "2025-09-01" },
  { id: "s13", firstName: "Temuulen", lastName: "Chinbat", email: "temuulen.c@school.edu", grade: "7th", parentName: "Ch. Chinbat", parentPhone: "+976 9911-1013", parentEmail: "chinbat@email.com", enrollmentDate: "2025-09-01" },
  { id: "s14", firstName: "Uuriintuya", lastName: "Boldbaatar", email: "uuriintuya.b@school.edu", grade: "7th", parentName: "B. Boldbaatar", parentPhone: "+976 9911-1014", parentEmail: "boldbaatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s15", firstName: "Zaya", lastName: "Byambadorj", email: "zaya.b@school.edu", grade: "7th", parentName: "B. Byambadorj", parentPhone: "+976 9911-1015", parentEmail: "byambadorj@email.com", enrollmentDate: "2025-09-01" },
  { id: "s16", firstName: "Amartuvshin", lastName: "Tserendorj", email: "amartuvshin.t@school.edu", grade: "7th", parentName: "Ts. Tserendorj", parentPhone: "+976 9911-1016", parentEmail: "tserendorj@email.com", enrollmentDate: "2025-09-01" },
  { id: "s17", firstName: "Battsengel", lastName: "Enkhbold", email: "battsengel.e@school.edu", grade: "7th", parentName: "E. Enkhbold", parentPhone: "+976 9911-1017", parentEmail: "enkhbold@email.com", enrollmentDate: "2025-09-01" },
  { id: "s18", firstName: "Chimeg", lastName: "Ganbaatar", email: "chimeg.g@school.edu", grade: "7th", parentName: "G. Ganbaatar", parentPhone: "+976 9911-1018", parentEmail: "ganbaatar@email.com", enrollmentDate: "2025-09-01" },
  { id: "s19", firstName: "Dulguun", lastName: "Purevjav", email: "dulguun.p@school.edu", grade: "7th", parentName: "P. Purevjav", parentPhone: "+976 9911-1019", parentEmail: "purevjav@email.com", enrollmentDate: "2025-09-01" },
  { id: "s20", firstName: "Erdenechimeg", lastName: "Sukhee", email: "erdenechimeg.s@school.edu", grade: "7th", parentName: "S. Sukhee", parentPhone: "+976 9911-1020", parentEmail: "sukhee@email.com", enrollmentDate: "2025-09-01" },
];

const scheduleData = [
  { id: "sch1", classId: "c1", period: 1, startTime: "08:00", endTime: "08:50", dayOfWeek: 1 },
  { id: "sch2", classId: "c2", period: 2, startTime: "09:00", endTime: "09:50", dayOfWeek: 1 },
  { id: "sch3", classId: "c3", period: 4, startTime: "11:00", endTime: "11:50", dayOfWeek: 1 },
  { id: "sch4", classId: "c4", period: 6, startTime: "13:00", endTime: "13:50", dayOfWeek: 1 },
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

const examsData = [
  { id: "e1", classId: "c1", name: "Quiz 1 - Integers", date: "2026-02-05", maxScore: 100, type: "quiz" as const, isPublished: true },
  { id: "e2", classId: "c1", name: "Quiz 2 - Fractions", date: "2026-02-12", maxScore: 100, type: "quiz" as const, isPublished: true },
  { id: "e3", classId: "c1", name: "Quiz 3 - Decimals", date: "2026-02-19", maxScore: 100, type: "quiz" as const, isPublished: false },
  { id: "e4", classId: "c2", name: "Quiz 1 - Integers", date: "2026-02-05", maxScore: 100, type: "quiz" as const, isPublished: true },
  { id: "e5", classId: "c2", name: "Quiz 2 - Fractions", date: "2026-02-12", maxScore: 100, type: "quiz" as const, isPublished: true },
  { id: "e6", classId: "c3", name: "Lab 1 - Cells", date: "2026-02-07", maxScore: 50, type: "project" as const, isPublished: true },
  { id: "e7", classId: "c3", name: "Test 1 - Biology Basics", date: "2026-02-14", maxScore: 100, type: "test" as const, isPublished: true },
  { id: "e8", classId: "c3", name: "Lab 2 - Microscope", date: "2026-02-21", maxScore: 50, type: "project" as const, isPublished: false },
  { id: "e9", classId: "c4", name: "Lab 1 - Cells", date: "2026-02-07", maxScore: 50, type: "project" as const, isPublished: true },
  { id: "e10", classId: "c4", name: "Test 1 - Biology Basics", date: "2026-02-14", maxScore: 100, type: "test" as const, isPublished: true },
];

const studentScoreRange: Record<string, [number, number]> = {
  s1: [80, 95], s2: [85, 98], s3: [55, 70], s4: [65, 80],
  s5: [70, 85], s6: [60, 75], s7: [75, 90], s8: [82, 95],
  s9: [88, 100], s10: [72, 85], s11: [68, 82], s12: [90, 100],
  s13: [65, 78], s14: [50, 65], s15: [78, 92], s16: [60, 75],
  s17: [85, 97], s18: [70, 82], s19: [55, 70], s20: [75, 88],
};

const absentProne: Record<string, string[]> = {
  s3: ["2026-02-09", "2026-02-16"],
  s5: ["2026-02-11"],
  s14: ["2026-02-10", "2026-02-17", "2026-02-19"],
  s18: ["2026-02-13"],
};

const lateProne: Record<string, string[]> = {
  s7: ["2026-02-10", "2026-02-17"],
  s16: ["2026-02-12"],
};

const attendanceDates = [
  "2026-02-09","2026-02-10","2026-02-11","2026-02-12","2026-02-13",
  "2026-02-16","2026-02-17","2026-02-18","2026-02-19","2026-02-20",
];

// ─── Messages data ───────────────────────────────────
const messagesData = [
  {
    id: "m1", parentName: "B. Boldbaatar", studentId: "s14", subject: "Regarding recent absences",
    isRead: false, lastMessageAt: "2026-02-22T14:20:00Z",
    thread: [
      { id: "mt1", senderName: "Ms. Johnson", content: "Dear Mr. Boldbaatar, I wanted to reach out regarding Uuriintuya's recent absences. She has missed 3 days this month which is affecting her class participation. Could we discuss this?", sentAt: "2026-02-21T10:00:00Z", isFromTeacher: true },
      { id: "mt2", senderName: "B. Boldbaatar", content: "Thank you for letting me know. I will make sure she attends regularly. She had some health issues but is better now.", sentAt: "2026-02-22T14:20:00Z", isFromTeacher: false },
    ],
  },
  {
    id: "m2", parentName: "Ts. Tseren", studentId: "s3", subject: "Math tutoring question",
    isRead: false, lastMessageAt: "2026-02-20T09:30:00Z",
    thread: [
      { id: "mt3", senderName: "Ts. Tseren", content: "Dear Ms. Johnson, Bolormaa is struggling with fractions at home. Is there any extra help available for her after school?", sentAt: "2026-02-20T09:30:00Z", isFromTeacher: false },
    ],
  },
  {
    id: "m3", parentName: "A. Altantsetseg", studentId: "s9", subject: "Science fair project",
    isRead: true, lastMessageAt: "2026-02-19T11:00:00Z",
    thread: [
      { id: "mt4", senderName: "Ms. Johnson", content: "I wanted to let you know that Nomin's science project proposal on plant growth was excellent. She should start working on the experiment soon.", sentAt: "2026-02-18T14:00:00Z", isFromTeacher: true },
      { id: "mt5", senderName: "A. Altantsetseg", content: "Nomin is very excited about the science fair! We already bought the supplies. Thank you for encouraging her.", sentAt: "2026-02-19T11:00:00Z", isFromTeacher: false },
    ],
  },
  {
    id: "m4", parentName: "M. Munkhbat", studentId: "s4", subject: "Field trip permission",
    isRead: true, lastMessageAt: "2026-02-17T16:45:00Z",
    thread: [
      { id: "mt6", senderName: "Ms. Johnson", content: "Dear Mr. Munkhbat, we're organizing a field trip to the Science Museum on March 5th. Please confirm if Dalai has permission to attend.", sentAt: "2026-02-17T10:00:00Z", isFromTeacher: true },
      { id: "mt7", senderName: "M. Munkhbat", content: "Yes, Dalai has our permission to attend the field trip. Thank you!", sentAt: "2026-02-17T16:45:00Z", isFromTeacher: false },
    ],
  },
  {
    id: "m5", parentName: "D. Dorj", studentId: "s7", subject: "Late arrivals",
    isRead: true, lastMessageAt: "2026-02-18T08:30:00Z",
    thread: [
      { id: "mt8", senderName: "Ms. Johnson", content: "I've noticed Khaliun has been arriving late to first period a few times recently. Is everything okay?", sentAt: "2026-02-17T15:00:00Z", isFromTeacher: true },
      { id: "mt9", senderName: "D. Dorj", content: "We are working on getting her to school on time. The bus schedule changed recently and we're adjusting. Thank you for your patience.", sentAt: "2026-02-18T08:30:00Z", isFromTeacher: false },
    ],
  },
];

const teacherNotesData = [
  { id: "n1", studentId: "s3", content: "Spoke with parent about Monday absences. Parent will ensure attendance.", createdAt: "2026-02-18T15:00:00Z" },
  { id: "n2", studentId: "s3", content: "Student struggling with fractions. Moved to front row. Extra worksheets assigned.", createdAt: "2026-02-10T14:30:00Z" },
  { id: "n3", studentId: "s14", content: "Three absences this month. Sent message to parent.", createdAt: "2026-02-21T10:15:00Z" },
  { id: "n4", studentId: "s9", content: "Excellent science fair proposal. Very engaged in class.", createdAt: "2026-02-18T14:15:00Z" },
  { id: "n5", studentId: "s7", content: "Late arrivals - bus schedule issue. Parent is addressing.", createdAt: "2026-02-18T08:45:00Z" },
  { id: "n6", studentId: "s12", content: "Consistently top performer. Consider recommending for advanced math.", createdAt: "2026-02-15T13:00:00Z" },
];

const actionItemsData = [
  { id: "a1", title: "Mark attendance for P1 - 7A Math", type: "attendance" as const, priority: "high" as const, link: "/attendance", isCompleted: false },
  { id: "a2", title: "2 parent messages awaiting reply", type: "message" as const, priority: "high" as const, link: "/messages", isCompleted: false },
  { id: "a3", title: "Publish Science Lab 2 scores (due today)", type: "grades" as const, priority: "high" as const, link: "/grades", isCompleted: false },
  { id: "a4", title: "Review Bold T. attendance pattern", type: "alert" as const, priority: "medium" as const, link: "/students/s3", isCompleted: false },
  { id: "a5", title: "Enter Quiz 3 - Decimals scores", type: "grades" as const, priority: "medium" as const, link: "/grades", isCompleted: false },
];

const activitiesData = [
  { id: "act1", description: "Published 7A Math Quiz 2 scores", type: "grade" as const, createdAt: "2026-02-23T06:30:00Z" },
  { id: "act2", description: "Parent of Uuriintuya replied to your message", type: "message" as const, createdAt: "2026-02-22T14:20:00Z" },
  { id: "act3", description: "Marked attendance for all classes", type: "attendance" as const, createdAt: "2026-02-22T08:15:00Z" },
  { id: "act4", description: "Published 7B Math Quiz 2 scores", type: "grade" as const, createdAt: "2026-02-21T15:00:00Z" },
  { id: "act5", description: "Sent progress report to Boldbaatar (Uuriintuya's parent)", type: "message" as const, createdAt: "2026-02-21T12:00:00Z" },
  { id: "act6", description: "Added note for Bold T. regarding Monday absences", type: "system" as const, createdAt: "2026-02-20T16:30:00Z" },
  { id: "act7", description: "Marked attendance for all classes", type: "attendance" as const, createdAt: "2026-02-20T08:10:00Z" },
];

// ─── Seed function ───────────────────────────────────
async function seed() {
  console.log("Seeding EduTrack database...\n");

  // 1. Create auth user
  console.log("1. Creating auth user...");
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
    email_confirm: true,
  });
  if (authError) {
    if (authError.message.includes("already been registered")) {
      console.log("   Auth user already exists, fetching...");
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users.find(u => u.email === DEV_EMAIL);
      if (!existing) throw new Error("Could not find existing auth user");
      (authData as any).user = existing;
    } else {
      throw authError;
    }
  }
  const authId = authData.user!.id;
  console.log(`   Auth user: ${authId}`);

  // 2. Insert teacher
  console.log("2. Inserting teacher...");
  const teacherId = toUuid(teacherData.id);
  const { error: teacherError } = await supabase.from("teachers").upsert({
    id: teacherId,
    auth_id: authId,
    name: teacherData.name,
    email: teacherData.email,
    subject: teacherData.subject,
  });
  if (teacherError) throw teacherError;

  // 3. Insert classes
  console.log("3. Inserting classes...");
  const { error: classError } = await supabase.from("classes").upsert(
    classesData.map(c => ({
      id: toUuid(c.id),
      teacher_id: teacherId,
      name: c.name,
      subject: c.subject,
      grade: c.grade,
      room: c.room,
    }))
  );
  if (classError) throw classError;

  // 4. Insert students
  console.log("4. Inserting students...");
  const { error: studentError } = await supabase.from("students").upsert(
    studentsData.map(s => ({
      id: toUuid(s.id),
      first_name: s.firstName,
      last_name: s.lastName,
      email: s.email,
      grade: s.grade,
      parent_name: s.parentName,
      parent_phone: s.parentPhone,
      parent_email: s.parentEmail,
      enrollment_date: s.enrollmentDate,
    }))
  );
  if (studentError) throw studentError;

  // 5. Insert class_students
  console.log("5. Inserting class-student relationships...");
  const classStudentRows: { class_id: string; student_id: string }[] = [];
  for (const [classId, studentIds] of Object.entries(classStudentMap)) {
    for (const studentId of studentIds) {
      classStudentRows.push({
        class_id: toUuid(classId),
        student_id: toUuid(studentId),
      });
    }
  }
  const { error: csError } = await supabase.from("class_students").upsert(classStudentRows);
  if (csError) throw csError;

  // 6. Insert schedule items
  console.log("6. Inserting schedule...");
  const { error: schedError } = await supabase.from("schedule_items").upsert(
    scheduleData.map(s => ({
      id: toUuid(s.id),
      class_id: toUuid(s.classId),
      period: s.period,
      start_time: s.startTime,
      end_time: s.endTime,
      day_of_week: s.dayOfWeek,
    }))
  );
  if (schedError) throw schedError;

  // 7. Insert attendance records
  console.log("7. Inserting attendance records...");
  const attendanceRows: {
    id: string; student_id: string; class_id: string; date: string;
    status: string;
  }[] = [];
  let attId = 1;
  for (const cls of classesData) {
    for (const date of attendanceDates) {
      for (const studentId of classStudentMap[cls.id]) {
        let status = "present";
        if (absentProne[studentId]?.includes(date)) {
          status = "absent";
        } else if (lateProne[studentId]?.includes(date)) {
          status = "late";
        }
        attendanceRows.push({
          id: toUuid(`att${attId++}`),
          student_id: toUuid(studentId),
          class_id: toUuid(cls.id),
          date,
          status,
        });
      }
    }
  }
  // Insert in batches of 500
  for (let i = 0; i < attendanceRows.length; i += 500) {
    const batch = attendanceRows.slice(i, i + 500);
    const { error } = await supabase.from("attendance_records").upsert(batch);
    if (error) throw error;
  }
  console.log(`   Inserted ${attendanceRows.length} attendance records`);

  // 8. Insert exams
  console.log("8. Inserting exams...");
  const { error: examError } = await supabase.from("exams").upsert(
    examsData.map(e => ({
      id: toUuid(e.id),
      class_id: toUuid(e.classId),
      name: e.name,
      date: e.date,
      max_score: e.maxScore,
      type: e.type,
      is_published: e.isPublished,
    }))
  );
  if (examError) throw examError;

  // 9. Insert grade entries (with seeded RNG matching mock-data.ts)
  console.log("9. Inserting grade entries...");
  const rng = createSeededRng(42);
  const gradeRows: {
    id: string; student_id: string; exam_id: string; class_id: string;
    score: number | null; letter_grade: string | null; is_published: boolean;
  }[] = [];
  let gId = 1;
  for (const exam of examsData) {
    const studentIds = classStudentMap[exam.classId];
    for (const studentId of studentIds) {
      const [min, max] = studentScoreRange[studentId] || [60, 80];
      const rawScore = Math.floor(rng() * (max - min + 1)) + min;
      const score = Math.min(rawScore, exam.maxScore);
      const letterGrade = calculateLetterGrade(score, exam.maxScore);
      gradeRows.push({
        id: toUuid(`g${gId++}`),
        student_id: toUuid(studentId),
        exam_id: toUuid(exam.id),
        class_id: toUuid(exam.classId),
        score: exam.isPublished ? score : (rng() > 0.3 ? score : null),
        letter_grade: exam.isPublished ? letterGrade : null,
        is_published: exam.isPublished,
      });
    }
  }
  const { error: gradeError } = await supabase.from("grade_entries").upsert(gradeRows);
  if (gradeError) throw gradeError;
  console.log(`   Inserted ${gradeRows.length} grade entries`);

  // 10. Insert messages and message items
  console.log("10. Inserting messages...");
  const { error: msgError } = await supabase.from("messages").upsert(
    messagesData.map(m => ({
      id: toUuid(m.id),
      teacher_id: teacherId,
      parent_name: m.parentName,
      student_id: toUuid(m.studentId),
      subject: m.subject,
      is_read: m.isRead,
      last_message_at: m.lastMessageAt,
    }))
  );
  if (msgError) throw msgError;

  const messageItemRows = messagesData.flatMap(m =>
    m.thread.map(t => ({
      id: toUuid(t.id),
      message_id: toUuid(m.id),
      sender_name: t.senderName,
      content: t.content,
      is_from_teacher: t.isFromTeacher,
      sent_at: t.sentAt,
    }))
  );
  const { error: miError } = await supabase.from("message_items").upsert(messageItemRows);
  if (miError) throw miError;

  // 11. Insert teacher notes
  console.log("11. Inserting teacher notes...");
  const { error: noteError } = await supabase.from("teacher_notes").upsert(
    teacherNotesData.map(n => ({
      id: toUuid(n.id),
      teacher_id: teacherId,
      student_id: toUuid(n.studentId),
      content: n.content,
      created_at: n.createdAt,
    }))
  );
  if (noteError) throw noteError;

  // 12. Insert action items
  console.log("12. Inserting action items...");
  const { error: aiError } = await supabase.from("action_items").upsert(
    actionItemsData.map(a => ({
      id: toUuid(a.id),
      teacher_id: teacherId,
      title: a.title,
      type: a.type,
      priority: a.priority,
      link: a.link,
      is_completed: a.isCompleted,
    }))
  );
  if (aiError) throw aiError;

  // 13. Insert activities
  console.log("13. Inserting activities...");
  const { error: actError } = await supabase.from("activities").upsert(
    activitiesData.map(a => ({
      id: toUuid(a.id),
      teacher_id: teacherId,
      description: a.description,
      type: a.type,
      created_at: a.createdAt,
    }))
  );
  if (actError) throw actError;

  console.log("\nSeed complete!");
  console.log(`\nDev login: ${DEV_EMAIL} / ${DEV_PASSWORD}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
