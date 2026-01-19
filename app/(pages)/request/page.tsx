"use client";
import { forbidden } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RequestPage() {
  const identity = useQuery(api.users.getForCurrentUser);

  if (!identity) {
    forbidden();
  }

  const user = useQuery(api.users.getConnectedAndCompletedUser, {
    subject: identity.subject,
  });

  return (
    <main className="flex min-h-200 flex-col items-center justify-between p-2">
      <p>Ceci est une page de Request</p>
    </main>
  );
}
