"use client";
import { forbidden } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  addToast,
  DatePicker,
} from "@heroui/react";
import { useState, SetStateAction, Dispatch } from "react";
import Link from "next/link";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export default function RequestPage() {
  const identity = useQuery(api.users.getForCurrentUser);

  if (!identity) {
    forbidden();
  }

  const user = useQuery(api.users.getConnectedAndCompletedUser, {
    subject: identity.subject,
  });

  if (!user) {
    forbidden();
  }

  const nMoins1 = useQuery(api.users.getNmoins1, {
    managerId: user._id,
  });

  const leaveTypes = useQuery(api.leave.getLeaveTypes);

  const [forWho, setForWho] = useState("me");
  const [assignedId, setAssignedId]: [
    assignedId: Id<"users">,
    setAssignedId: Dispatch<SetStateAction<Id<"users">>>,
  ] = useState(user._id);
  const [startDate, setStartDate] = useState(
    parseAbsoluteToLocal("2025-04-07T18:45:22Z"),
  );

  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal("2025-04-07T18:45:22Z"),
  );

  const [leaveType, setLeaveType]: [
    leaveType: Id<"leavetypes">,
    setLeaveType: Dispatch<SetStateAction<Id<"leavetypes">>>,
  ] = useState("" as Id<"leavetypes">);

  const [success, setSuccess] = useState(false);

  const createLeave = useMutation(api.leave.saveLeave);

  const formatter = useDateFormatter({
    dateStyle: "full",
  });

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (leaveType === "" || !startDate || !endDate || !assignedId) {
      addToast({ title: "Veuillez remplir tous les champs", color: "danger" });
      return;
    }

    const data = {
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      leaveType,
      assignedId,
      assignerId: user._id,
    };

    await createLeave(data);
    addToast({ title: "Congé/RTT demandé avec succès", color: "success" });
    setSuccess(true);
  };

  return (
    <main className="flex min-h-auto flex-col items-center justify-between p-2 ">
      {!success ? (
        <>
          <h2>Demander un congé/RTT</h2>
          <form
            className="flex flex-col p-5"
            onSubmit={async (event: React.SyntheticEvent) => {
              await handleSubmit(event);
            }}
          >
            <div className="flex flex-row items-center p-5">
              <RadioGroup label="Pour qui ? :">
                <Radio
                  name="forwho"
                  value="me"
                  defaultChecked={forWho === "me"}
                  onChange={() => setForWho("me")}
                >
                  Pour moi
                </Radio>
                <Radio
                  name="forwho"
                  value="other"
                  defaultChecked={forWho === "other"}
                  onChange={() => setForWho("other")}
                >
                  Pour quelqu&apos;un d&apos;autre
                </Radio>
              </RadioGroup>
            </div>
            {forWho !== "me" && nMoins1 && nMoins1.length > 0 && (
              <div>
                <Select
                  name="collaborator"
                  label="Sélectionner un collaborateur: "
                  onChange={(value) =>
                    setAssignedId(value as unknown as Id<"users">)
                  }
                  labelPlacement="outside-left"
                  placeholder="Veuillez sélectionner un collaborateur"
                  isRequired
                >
                  {nMoins1
                    .map((user) => ({
                      key: user._id,
                      label: `${user.firstname}  ${user.lastname} (${user.email})}`,
                    }))
                    .map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                </Select>
              </div>
            )}
            {leaveTypes && leaveTypes.length > 0 && (
              <div className="mb-5">
                <Select
                  name="leaveType"
                  label="Sélectionner un type de congé: "
                  onChange={(value) =>
                    setLeaveType(value as unknown as Id<"leavetypes">)
                  }
                  labelPlacement="outside-left"
                  placeholder="Veuillez sélectionner un type de congé"
                  isRequired
                >
                  {...leaveTypes.map((item) => (
                    <SelectItem key={item._id}>{item.label}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
            <div className="w-full flex flex-col gap-y-2">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                granularity="day"
                showMonthAndYearPickers
                label="Date de début"
                variant="bordered"
              />
              <p className="text-default-500 text-sm">
                Date de début :{" "}
                {startDate ? formatter.format(startDate.toDate()) : "--"}{" "}
              </p>
            </div>
            <div className="w-full flex flex-col gap-y-2">
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                granularity="day"
                minValue={startDate}
                showMonthAndYearPickers
                label="Date de fin"
                variant="bordered"
              />
              <p className="text-default-500 text-sm">
                Date de fin :{" "}
                {endDate ? formatter.format(endDate.toDate()) : "--"}{" "}
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10 hover:cursor-pointer"
            >
              Valider
            </button>
          </form>
        </>
      ) : (
        <div className="border border-s-slate-950 shadow-2xl p-4 rounded">
          <p className="font-bold text-center">
            Félicitations ! Votre demande de congé a été soumise avec succès.
          </p>
          <div className="flex flex-row p-2">
            <button
              onClick={() => setSuccess(false)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10 hover:cursor-pointer"
            >
              Faire une nouvelle demande
            </button>
            <button>
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10 hover:cursor-pointer"
              >
                Retourner à l&apos;accueil
              </Link>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
