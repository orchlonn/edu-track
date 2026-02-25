"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { formatTime, cn } from "@/lib/utils";
import { type ScheduleItem } from "@/lib/types";

interface ScheduleItemWithClass extends ScheduleItem {
  className: string;
  classRoom: string;
}

interface TodayScheduleProps {
  items: ScheduleItemWithClass[];
}

export function TodaySchedule({ items }: TodayScheduleProps) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (items.length === 0) {
    return (
      <Card title="Today's Schedule">
        <p className="text-sm text-gray-500">No classes scheduled today.</p>
      </Card>
    );
  }

  return (
    <Card title="Today's Schedule">
      <div className="space-y-1">
        {[1, 2, 3, 4, 5, 6, 7].map((period) => {
          const scheduleItem = items.find((s) => s.period === period);

          if (!scheduleItem) {
            if (period === 3) {
              return (
                <div key={period} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400">
                  <span className="w-6 text-center text-xs font-medium">P{period}</span>
                  <span className="text-sm">10:00 AM</span>
                  <span className="text-sm italic">Free Period</span>
                </div>
              );
            }
            if (period === 5) {
              return (
                <div key={period} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400">
                  <span className="w-6 text-center text-xs font-medium">P{period}</span>
                  <span className="text-sm">12:00 PM</span>
                  <span className="text-sm italic">Lunch</span>
                </div>
              );
            }
            return null;
          }

          const [startH, startM] = scheduleItem.startTime.split(":").map(Number);
          const [endH, endM] = scheduleItem.endTime.split(":").map(Number);
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;

          const isPast = currentMinutes > endMinutes;
          const isCurrent = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

          return (
            <Link
              key={period}
              href="/attendance"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                isCurrent && "bg-blue-50 ring-1 ring-blue-200",
                isPast && "opacity-60",
                !isCurrent && !isPast && "hover:bg-gray-50",
              )}
            >
              <span className="w-6 text-center text-xs font-semibold text-gray-500">
                P{scheduleItem.period}
              </span>
              <span className="w-16 text-xs text-gray-500">
                {formatTime(scheduleItem.startTime)}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800">
                {scheduleItem.className}
              </span>
              <span className="hidden items-center gap-1 text-xs text-gray-500 sm:flex">
                <MapPin className="h-3 w-3" />
                {scheduleItem.classRoom}
              </span>
              {isPast ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : isCurrent ? (
                <Badge variant="info">Now</Badge>
              ) : (
                <Clock className="h-4 w-4 text-gray-300" />
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
