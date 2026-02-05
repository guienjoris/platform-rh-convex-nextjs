import { CalendarDate } from "@internationalized/date";
import { months } from "./constants/months";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

type LeavesPlanning = FunctionReturnType<typeof api.leave.getLeavesByDateForMe>;

type PlanningProps = {
  calendarDate: CalendarDate;
  leaves?: LeavesPlanning | null | undefined;
};

function Cell({ day }: { day: number }) {
  return (
    <div className="border border-gray-400 h-40 w-40">
      <p className="absolute">{day}</p>

      <div className="flex items-center justify-items-center h-full w-full">
        <div className="w-full h-0.5 bg-gray-300" />
      </div>
    </div>
  );
}

export default function Planning({ calendarDate, leaves }: PlanningProps) {
  const month = months[calendarDate.month - 1];
  const numOfDays = new Date(
    calendarDate.year,
    calendarDate.month,
    0,
  ).getDate();

  console.log({ leaves });

  return (
    <div className="flex items-center flex-col">
      <h1>Planning de {month}</h1>
      <div className="grid grid-cols-8 gap-0">
        {Array.from({ length: numOfDays }, (_, i) => (
          <Cell key={i} day={i + 1} />
        ))}
      </div>
    </div>
  );
}
