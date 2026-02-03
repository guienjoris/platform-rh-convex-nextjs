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

  const formatter = useDateFormatter({
    dateStyle: "short",
  });

  const [startDate, setStartDate] = useState(
    parseAbsoluteToLocal(new Date().toISOString()),
  );

  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(new Date().toISOString()),
  );

  const [leaveType, setLeaveType] = useState("" as Id<"leavetypes">);

  const [success, setSuccess] = useState(false);

  const createLeave = useMutation(api.leave.saveLeave);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (leaveType === "" || !startDate || !endDate || !assignedId) {
      addToast({ title: "Veuillez remplir tous les champs", color: "danger" });
      return;
    }

    const data = {
      startDate: formatter.format(startDate.toDate()),
      endDate: formatter.format(endDate.toDate()),
      leaveType,
      assignedId,
      assignerId: user._id,
    };

    await createLeave(data);
    addToast({ title: "Congé/RTT demandé avec succès", color: "success" });
    setSuccess(true);
  };

  return (
    <main className="flex flex-col items-center h-auto justify-center  ">
      {!success ? (
        <>
          <h2 className="font-bold text-center p-2 mb-5">
            Demander un congé/RTT
          </h2>
          <form
            className="flex flex-col border-gray-300 border rounded-2xl p-2 shadow-xl w-[40%]"
            onSubmit={async (event: React.SyntheticEvent) => {
              await handleSubmit(event);
            }}
          >
            <div className="p-5">
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
              <div className="mb-2">
                <Select
                  name="collaborator"
                  label="Sélectionner un collaborateur: "
                  onChange={(value) =>
                    setAssignedId(value.target.value as Id<"users">)
                  }
                  labelPlacement="inside"
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
                    setLeaveType(value.target.value as Id<"leavetypes">)
                  }
                  selectedKeys={[leaveType]}
                  labelPlacement="inside"
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
                onChange={(value) => value && setStartDate(value)}
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
                onChange={(value) => value && setEndDate(value)}
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
