"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const users = useQuery(api.users.get);
  return (
    <main className="flex min-h-200 flex-col items-center justify-between p-2">
      {users?.map(({ _id, lastname, firstname, isRH }) => (
        <div key={_id}>
          <p>Nom de famille:{lastname}</p>
          <p>Prénom:{firstname}</p>
          <p>RH: {isRH ? "Oui" : "Non"}</p>
        </div>
      ))}
    </main>
  );
}
