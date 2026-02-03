"use client";
import { forbidden } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

  const leaves = useQuery(api.leave.getLeavesForMe, { assignedId: user._id });

  return <p>page calendar</p>;
}
