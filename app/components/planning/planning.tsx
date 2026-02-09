import { CalendarDate } from "@internationalized/date";
import { months } from "./constants/months";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

type LeavesPlanning = FunctionReturnType<typeof api.leave.getLeavesByDateForMe>;

type PlanningProps = {
  calendarDate: CalendarDate;
  leaves?: LeavesPlanning | null | undefined;
};

function Modal({
  leave,
  displayModal,
  setDisplayModal,
}: {
  leave: any;
  displayModal: boolean;
  setDisplayModal: (value: boolean) => void;
}) {
  return (
    <div
      className={`${displayModal ? "block" : "hidden"} p-10 bg-white border border-gray-400 rounded-2xl absolute w-auto h-auto shadow-md left-[50%] translate -translate-x-1/2 -translate-y-1/2 mt-50`}
    >
      <div
        onClick={() => setDisplayModal(false)}
        className="flex flex-row justify-between items-center "
      >
        <p className="text-center font-bold mb-2">Détails du congé</p>
        <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-800 transition delay-75 cursor-pointer">
          X
        </button>
      </div>
      <div className="pt-8">
        <p>Type de congé: {leave?.leaveType?.label}</p>
        <p>
          Date de début: {new Date(leave?.startDate)?.toLocaleString("fr-FR")}
        </p>
        <p>Date de fin: {new Date(leave?.endDate)?.toLocaleString("fr-FR")}</p>
      </div>
    </div>
  );
}

function Cell({
  day,
  leave,
  setDisplayModal,
  setLeaveSelected,
}: {
  day: number;
  leave?: any;
  setDisplayModal: (value: boolean) => void;
  setLeaveSelected: (value: any) => void;
}) {
  return (
    <div className="border border-gray-400 h-40 w-40 hover:bg-amber-100 cursor-pointer ">
      <p className="absolute">{day}</p>
      {leave && (
        <div
          onClick={() => {
            setLeaveSelected(leave);
            setDisplayModal(true);
          }}
          className="flex flex-col text-center items-center bg-blue-400 rounded p-2 m-5 hover:bg-blue-900 transition-all delay-75"
        >
          <div className="text-white">{leave?.leaveType?.code}</div>
        </div>
      )}

      {/*<div className="flex items-center justify-items-center h-full w-full">
        <div className="w-full h-0.5 bg-gray-300" />
      </div>*/}
    </div>
  );
}

export default function Planning({ calendarDate, leaves }: PlanningProps) {
  const [displayModal, setDisplayModal] = useState(false);
  const [leaveSelected, setLeaveSelected] = useState(undefined);
  const month = months[calendarDate.month - 1];
  const numOfDays = new Date(
    calendarDate.year,
    calendarDate.month,
    0,
  ).getDate();

  return (
    <div className="flex items-center flex-col">
      <h1>Planning de {month}</h1>
      <div className="grid grid-cols-8 gap-0">
        {Array.from({ length: numOfDays }, (_, i) => {
          const leaveFind = leaves?.leaves?.find(
            (leave) =>
              (new Date(leave.endDate).getDate() <= i + 1 &&
                new Date(leave.startDate).getDate() >= i + 1) ||
              new Date(leave.startDate).getDate() === i + 1,
          );
          return (
            <Cell
              setDisplayModal={setDisplayModal}
              setLeaveSelected={setLeaveSelected}
              key={i}
              day={i + 1}
              leave={leaveFind}
            />
          );
        })}
        {displayModal && (
          <Modal
            leave={leaveSelected}
            displayModal={displayModal}
            setDisplayModal={setDisplayModal}
          />
        )}
      </div>
    </div>
  );
}
