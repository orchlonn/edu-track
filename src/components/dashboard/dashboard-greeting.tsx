"use client";

export function DashboardGreeting({ teacherName }: { teacherName: string }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        {greeting}, {teacherName}
      </h2>
      <p className="text-sm text-gray-500">
        Here&apos;s what&apos;s happening today
      </p>
    </div>
  );
}
