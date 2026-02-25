-- ================================================
-- EduTrack Initial Schema
-- ================================================

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. Teachers (linked to Supabase Auth)
create table teachers (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique not null references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  subject     text not null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- 2. Classes
create table classes (
  id          uuid primary key default uuid_generate_v4(),
  teacher_id  uuid not null references teachers(id) on delete cascade,
  name        text not null,
  subject     text not null,
  grade       text not null,
  room        text not null,
  created_at  timestamptz not null default now()
);

-- 3. Students
create table students (
  id              uuid primary key default uuid_generate_v4(),
  first_name      text not null,
  last_name       text not null,
  email           text not null unique,
  avatar_url      text,
  grade           text not null,
  parent_name     text not null,
  parent_phone    text not null,
  parent_email    text not null,
  enrollment_date date not null default current_date,
  created_at      timestamptz not null default now()
);

-- 4. Class-Student join table
create table class_students (
  class_id    uuid not null references classes(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  primary key (class_id, student_id)
);

-- 5. Schedule items
create table schedule_items (
  id          uuid primary key default uuid_generate_v4(),
  class_id    uuid not null references classes(id) on delete cascade,
  period      smallint not null,
  start_time  time not null,
  end_time    time not null,
  day_of_week smallint not null check (day_of_week between 0 and 6)
);

-- 6. Attendance
create type attendance_status as enum ('present', 'absent', 'late', 'excused');

create table attendance_records (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references students(id) on delete cascade,
  class_id    uuid not null references classes(id) on delete cascade,
  date        date not null,
  status      attendance_status not null default 'present',
  note        text,
  created_at  timestamptz not null default now(),
  unique (student_id, class_id, date)
);

-- 7. Exams
create type exam_type as enum ('quiz', 'test', 'midterm', 'final', 'homework', 'project');

create table exams (
  id           uuid primary key default uuid_generate_v4(),
  class_id     uuid not null references classes(id) on delete cascade,
  name         text not null,
  date         date not null,
  max_score    integer not null,
  type         exam_type not null,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 8. Grade entries
create table grade_entries (
  id           uuid primary key default uuid_generate_v4(),
  student_id   uuid not null references students(id) on delete cascade,
  exam_id      uuid not null references exams(id) on delete cascade,
  class_id     uuid not null references classes(id) on delete cascade,
  score        integer,
  letter_grade text,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (student_id, exam_id)
);

-- 9. Messages (thread header)
create table messages (
  id              uuid primary key default uuid_generate_v4(),
  teacher_id      uuid not null references teachers(id) on delete cascade,
  parent_name     text not null,
  student_id      uuid not null references students(id) on delete cascade,
  subject         text not null,
  is_read         boolean not null default false,
  last_message_at timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- 10. Message items (individual messages in a thread)
create table message_items (
  id              uuid primary key default uuid_generate_v4(),
  message_id      uuid not null references messages(id) on delete cascade,
  sender_name     text not null,
  content         text not null,
  is_from_teacher boolean not null default false,
  sent_at         timestamptz not null default now()
);

-- 11. Teacher notes
create table teacher_notes (
  id          uuid primary key default uuid_generate_v4(),
  teacher_id  uuid not null references teachers(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- 12. Action items
create type action_item_type as enum ('attendance', 'grades', 'message', 'alert');
create type action_priority as enum ('high', 'medium', 'low');

create table action_items (
  id           uuid primary key default uuid_generate_v4(),
  teacher_id   uuid not null references teachers(id) on delete cascade,
  title        text not null,
  type         action_item_type not null,
  priority     action_priority not null,
  link         text not null,
  is_completed boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 13. Activities (audit log)
create type activity_type as enum ('attendance', 'grade', 'message', 'system');

create table activities (
  id          uuid primary key default uuid_generate_v4(),
  teacher_id  uuid not null references teachers(id) on delete cascade,
  description text not null,
  type        activity_type not null,
  created_at  timestamptz not null default now()
);

-- ================================================
-- Indexes
-- ================================================
create index idx_class_students_student on class_students(student_id);
create index idx_class_students_class on class_students(class_id);
create index idx_attendance_class_date on attendance_records(class_id, date);
create index idx_attendance_student on attendance_records(student_id);
create index idx_grade_entries_exam on grade_entries(exam_id);
create index idx_grade_entries_student on grade_entries(student_id);
create index idx_exams_class on exams(class_id);
create index idx_messages_teacher on messages(teacher_id);
create index idx_messages_student on messages(student_id);
create index idx_message_items_message on message_items(message_id);
create index idx_teacher_notes_student on teacher_notes(student_id);
create index idx_schedule_items_class on schedule_items(class_id);
create index idx_schedule_items_day on schedule_items(day_of_week);

-- ================================================
-- Row Level Security
-- ================================================
alter table teachers enable row level security;
alter table classes enable row level security;
alter table students enable row level security;
alter table class_students enable row level security;
alter table schedule_items enable row level security;
alter table attendance_records enable row level security;
alter table exams enable row level security;
alter table grade_entries enable row level security;
alter table messages enable row level security;
alter table message_items enable row level security;
alter table teacher_notes enable row level security;
alter table action_items enable row level security;
alter table activities enable row level security;

-- Teachers: see own record
create policy "Teachers see own record"
  on teachers for select
  using (auth_id = auth.uid());

-- Classes: teachers manage own classes
create policy "Teachers manage own classes"
  on classes for all
  using (teacher_id = (select id from teachers where auth_id = auth.uid()));

-- Students: teachers see students in their classes
create policy "Teachers see their students"
  on students for select
  using (
    id in (
      select cs.student_id from class_students cs
      join classes c on c.id = cs.class_id
      where c.teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Class students: scoped by class ownership
create policy "Teachers manage class_students"
  on class_students for all
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Schedule items: scoped by class ownership
create policy "Teachers see schedule for own classes"
  on schedule_items for select
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Attendance: scoped by class ownership
create policy "Teachers manage attendance for own classes"
  on attendance_records for all
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Exams: scoped by class ownership
create policy "Teachers manage exams for own classes"
  on exams for all
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Grade entries: scoped by class ownership
create policy "Teachers manage grades for own classes"
  on grade_entries for all
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Messages: scoped by teacher
create policy "Teachers manage own messages"
  on messages for all
  using (teacher_id = (select id from teachers where auth_id = auth.uid()));

-- Message items: scoped through parent message
create policy "Teachers see message items"
  on message_items for all
  using (
    message_id in (
      select id from messages
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Teacher notes: scoped by teacher
create policy "Teachers manage own notes"
  on teacher_notes for all
  using (teacher_id = (select id from teachers where auth_id = auth.uid()));

-- Action items: scoped by teacher
create policy "Teachers manage own action items"
  on action_items for all
  using (teacher_id = (select id from teachers where auth_id = auth.uid()));

-- Activities: scoped by teacher
create policy "Teachers see own activities"
  on activities for all
  using (teacher_id = (select id from teachers where auth_id = auth.uid()));
