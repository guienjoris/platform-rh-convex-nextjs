"use client";
import { forbidden } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RequestPage() {
  const user = useQuery(api.users.getForCurrentUser);

  if (!user) {
    forbidden();
  }
  return (
    <main className="flex min-h-200 flex-col items-center justify-between p-2">
      <p>Ceci est une page de Request</p>
    </main>
  );
}
