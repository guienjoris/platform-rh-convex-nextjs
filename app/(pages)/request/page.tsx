"use client";
import { forbidden } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Radio, Select } from "@/app/components/ui";
import { useState, SetStateAction, Dispatch } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { showToast } from "nextjs-toast-notify";
import Link from "next/link";

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
  const [startDate, setStartDate]: [
    startDate: Date,
    setStartDate: Dispatch<SetStateAction<Date>>,
  ] = useState(new Date());

  const [endDate, setEndDate]: [
    endDate: Date,
    setEndDate: Dispatch<SetStateAction<Date>>,
  ] = useState(new Date());

  const [leaveType, setLeaveType]: [
    leaveType: Id<"leavetypes">,
    setLeaveType: Dispatch<SetStateAction<Id<"leavetypes">>>,
  ] = useState("" as Id<"leavetypes">);

  const [success, setSuccess] = useState(false);

  const createLeave = useMutation(api.leave.saveLeave);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (leaveType === "" || !startDate || !endDate || !assignedId) {
      showToast.error("Veuillez remplir tous les champs");
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
    showToast.success("Congé demandé avec succès");
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
              <p className="font-bold">Pour qui ? : </p>
              <Radio
                name="forwho"
                value="me"
                label="Pour moi"
                defaultChecked={forWho === "me"}
                onChange={() => setForWho("me")}
              />
              <Radio
                name="forwho"
                value="other"
                label="Pour quelqu'un d'autre"
                defaultChecked={forWho === "other"}
                onChange={() => setForWho("other")}
              />
            </div>
            {forWho !== "me" && nMoins1 && nMoins1.length > 0 && (
              <div>
                <Select
                  name="collaborator"
                  label="Sélectionner un collaborateur"
                  required={forWho === "other"}
                  onChange={(value) => setAssignedId(value as Id<"users">)}
                  options={nMoins1.map((user) => ({
                    value: user._id,
                    label: `${user.firstname}  ${user.lastname} (${user.email})}`,
                  }))}
                />
              </div>
            )}
            {leaveTypes && leaveTypes.length > 0 && (
              <div>
                <Select
                  onChange={(value) => setLeaveType(value as Id<"leavetypes">)}
                  required
                  name="leaveType"
                  label="Sélectionner un type de congé"
                  defaultValue=""
                  options={[
                    {
                      label: "Veuillez sélectionner un type de congé",
                      value: "",
                    },
                    ...leaveTypes.map((type) => ({
                      value: type._id,
                      label: type.label,
                    })),
                  ]}
                />
              </div>
            )}
            <div className="flex justify-between p-5 items-center">
              <p className="font-bold mr-5">Date de début :</p>
              <DayPicker
                animate
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                required
                footer={
                  startDate
                    ? `${startDate.toLocaleDateString()}`
                    : "Sélectionner une date."
                }
              />
            </div>
            <div className="flex justify-between p-5 items-center">
              <p className="font-bold mr-5">Date de fin :</p>
              <DayPicker
                animate
                mode="single"
                disabled={{ before: startDate }}
                selected={endDate}
                onSelect={setEndDate}
                required
                footer={
                  endDate
                    ? `${endDate.toLocaleDateString()}`
                    : "Sélectionner une date."
                }
              />
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
