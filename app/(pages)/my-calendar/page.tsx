"use client";
import { forbidden } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, SetStateAction, Dispatch } from "react";
import {
  CalendarDate,
  startOfMonth,
  endOfMonth,
  getLocalTimeZone,
} from "@internationalized/date";
import Planning from "@/app/components/planning/planning";

export default function MyCalendar() {
  const identity = useQuery(api.users.getForCurrentUser);

  if (!identity) {
    forbidden();
  }

  const user = useQuery(api.users.getConnectedAndCompletedUser, {
    subject: identity?.subject,
  });

  if (!user) {
    forbidden();
  }

  const currentDate = new Date();

  const [calendarDate, setCalendarDate]: [
    CalendarDate,
    Dispatch<SetStateAction<CalendarDate>>,
  ] = useState(
    new CalendarDate(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    ),
  );

  const [startDate, setStartDate] = useState(
    startOfMonth(calendarDate).toDate(getLocalTimeZone()).toISOString(),
  );
  const [endDate, setEndDate] = useState(
    endOfMonth(calendarDate).toDate(getLocalTimeZone()).toISOString(),
  );

  useEffect(() => {
    setStartDate(
      startOfMonth(calendarDate).toDate(getLocalTimeZone()).toISOString(),
    );
    setEndDate(
      endOfMonth(calendarDate).toDate(getLocalTimeZone()).toISOString(),
    );
  }, [calendarDate]);

  const leaves = useQuery(api.leave.getLeavesByDateForMe, {
    assignedId: user._id,
    startDate,
    endDate,
  });

  return (
    <div>
      <Planning
        calendarDate={calendarDate}
        leaves={leaves}
        setCalendarDate={setCalendarDate}
      />
    </div>
  );
}
