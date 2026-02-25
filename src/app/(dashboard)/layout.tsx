import { ClassProvider } from "@/contexts/class-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getUnreadMessageCount } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadCount = await getUnreadMessageCount();

  return (
    <ClassProvider>
      <DashboardShell unreadCount={unreadCount}>{children}</DashboardShell>
    </ClassProvider>
  );
}
