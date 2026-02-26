-- Fix: schedule_items policy was SELECT-only, preventing teachers from
-- creating, updating, or deleting schedule items.

drop policy "Teachers see schedule for own classes" on schedule_items;

create policy "Teachers manage schedule for own classes"
  on schedule_items for all
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );

-- Restrict class_students to read-only for teachers.
-- Student enrollment is managed by admins, not teachers.

drop policy "Teachers manage class_students" on class_students;

create policy "Teachers view class_students"
  on class_students for select
  using (
    class_id in (
      select id from classes
      where teacher_id = (select id from teachers where auth_id = auth.uid())
    )
  );
