"use client";
import { forbidden } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import { useCallback } from "react";

export default function MyRequestsPage() {
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

  const columns = [
    { name: "Date de début", uid: "startDate" },
    { name: "Date de fin", uid: "endDate" },
    { name: "Type de congé", uid: "leaveType" },
    { name: "Statut", uid: "status" },
  ];

  const filteredLeaves =
    leaves?.leaves && leaves.leaves.filter((leave) => leave !== null);

  const renderCell = useCallback((leave, columnKey) => {
    const cellValue = leave[columnKey];

    switch (columnKey) {
      case "startDate":
        return <p>{leave.startDate}</p>;
      case "endDate":
        return <p>{leave.endDate}</p>;
      case "leaveType":
        return <p>{leave.leaveType?.label}</p>;
      case "status":
        return <p>{leave.validatedBy ? "Validé" : "En attente"}</p>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="p-5 w-[60%]">
        <h2 className="text-center p-2 mb-5 font-bold">
          Tableau de mes demandes
        </h2>
        <Table aria-label="Table of leaves requests">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={"center"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"Pas de lignes à afficher."}
            items={filteredLeaves ?? []}
          >
            {(leave) => (
              <TableRow key={leave._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(leave, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
