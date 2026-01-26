"use client";
import { forbidden } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PlanningPage() {
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

  const leaves = useQuery(api.leave.getLeavesForMe, { assignedId: user._id });

  console.log(user._id, { leaves });

  return (
    <main className="flex min-h-200 flex-col items-center justify-between p-2">
      <table className="border-2 border-solid border-[rgb(140 140 140)]">
        <thead>
          <tr>
            <th scope="col">Date de début</th>
            <th scope="col">Date de fin</th>
            <th scope="col">Type de congé</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody className="even: bg-[rgb(237 238 242)]">
          {leaves &&
            leaves.leaves.length > 0 &&
            leaves.leaves.map((leave) => (
              <tr key={leave._id}>
                <td scope="row">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.leaveType?.label}</td>
                <td>{leave.validatedBy ? "Validé" : "En attente"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}
